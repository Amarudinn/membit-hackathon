import os
import json
import pyotp
import qrcode
import bcrypt
import secrets
from pathlib import Path
from io import BytesIO
import base64

class AuthManager:
    """Manage authentication with 2FA (TOTP)"""
    
    def __init__(self, config_file='auth_config.json'):
        self.config_path = Path(__file__).parent / config_file
        self.config = self._load_config()
    
    def _load_config(self):
        """Load auth configuration from file"""
        if self.config_path.exists():
            with open(self.config_path, 'r') as f:
                return json.load(f)
        return {
            'setup_completed': False,
            'username': None,
            'password_hash': None,
            'totp_secret': None,
            'backup_codes': []
        }
    
    def _save_config(self):
        """Save auth configuration to file"""
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def is_setup_completed(self):
        """Check if initial setup is completed"""
        return self.config.get('setup_completed', False)
    
    def setup_auth(self, username, password):
        """
        Setup authentication for first time
        Returns: (success, qr_code_base64, totp_secret, backup_codes, error)
        """
        try:
            # Validate input
            if not username or len(username) < 3:
                return False, None, None, None, "Username must be at least 3 characters"
            
            if not password or len(password) < 8:
                return False, None, None, None, "Password must be at least 8 characters"
            
            # Generate TOTP secret
            totp_secret = pyotp.random_base32()
            
            # Hash password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            # Generate backup codes (10 codes)
            backup_codes = [secrets.token_hex(4).upper() for _ in range(10)]
            backup_codes_hashed = [
                bcrypt.hashpw(code.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                for code in backup_codes
            ]
            
            # Generate QR code
            totp = pyotp.TOTP(totp_secret)
            uri = totp.provisioning_uri(
                name=username,
                issuer_name="Twitter Bot"
            )
            
            # Create QR code image
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(uri)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            qr_code_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            # Save config (but not mark as completed yet)
            self.config = {
                'setup_completed': False,  # Will be set to True after verification
                'username': username,
                'password_hash': password_hash.decode('utf-8'),
                'totp_secret': totp_secret,
                'backup_codes': backup_codes_hashed
            }
            self._save_config()
            
            return True, qr_code_base64, totp_secret, backup_codes, None
            
        except Exception as e:
            return False, None, None, None, str(e)
    
    def verify_setup(self, totp_code):
        """
        Verify TOTP code during setup
        Returns: (success, error)
        """
        try:
            if self.config.get('setup_completed'):
                return False, "Setup already completed"
            
            totp_secret = self.config.get('totp_secret')
            if not totp_secret:
                return False, "Setup not initialized"
            
            # Verify TOTP code
            totp = pyotp.TOTP(totp_secret)
            if totp.verify(totp_code, valid_window=1):
                # Mark setup as completed
                self.config['setup_completed'] = True
                self._save_config()
                return True, None
            else:
                return False, "Invalid verification code"
                
        except Exception as e:
            return False, str(e)
    
    def verify_login(self, username, password, totp_code):
        """
        Verify login credentials with 2FA
        Returns: (success, error)
        """
        try:
            if not self.config.get('setup_completed'):
                return False, "Setup not completed"
            
            # Check username
            if username != self.config.get('username'):
                return False, "Invalid credentials"
            
            # Check password
            stored_hash = self.config.get('password_hash')
            if not bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
                return False, "Invalid credentials"
            
            # Check TOTP code
            totp_secret = self.config.get('totp_secret')
            totp = pyotp.TOTP(totp_secret)
            
            if totp.verify(totp_code, valid_window=1):
                return True, None
            else:
                # Try backup codes
                backup_codes = self.config.get('backup_codes', [])
                for idx, hashed_code in enumerate(backup_codes):
                    if bcrypt.checkpw(totp_code.encode('utf-8'), hashed_code.encode('utf-8')):
                        # Remove used backup code
                        self.config['backup_codes'].pop(idx)
                        self._save_config()
                        return True, None
                
                return False, "Invalid verification code"
                
        except Exception as e:
            return False, str(e)
    
    def change_password(self, old_password, new_password, totp_code):
        """
        Change password (requires old password + TOTP)
        Returns: (success, error)
        """
        try:
            if not self.config.get('setup_completed'):
                return False, "Setup not completed"
            
            # Verify old password
            stored_hash = self.config.get('password_hash')
            if not bcrypt.checkpw(old_password.encode('utf-8'), stored_hash.encode('utf-8')):
                return False, "Invalid current password"
            
            # Verify TOTP
            totp_secret = self.config.get('totp_secret')
            totp = pyotp.TOTP(totp_secret)
            if not totp.verify(totp_code, valid_window=1):
                return False, "Invalid verification code"
            
            # Validate new password
            if not new_password or len(new_password) < 8:
                return False, "New password must be at least 8 characters"
            
            # Hash and save new password
            new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            self.config['password_hash'] = new_hash.decode('utf-8')
            self._save_config()
            
            return True, None
            
        except Exception as e:
            return False, str(e)
    
    def regenerate_backup_codes(self, password, totp_code):
        """
        Regenerate backup codes (requires password + TOTP)
        Returns: (success, backup_codes, error)
        """
        try:
            if not self.config.get('setup_completed'):
                return False, None, "Setup not completed"
            
            # Verify password
            stored_hash = self.config.get('password_hash')
            if not bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
                return False, None, "Invalid password"
            
            # Verify TOTP
            totp_secret = self.config.get('totp_secret')
            totp = pyotp.TOTP(totp_secret)
            if not totp.verify(totp_code, valid_window=1):
                return False, None, "Invalid verification code"
            
            # Generate new backup codes
            backup_codes = [secrets.token_hex(4).upper() for _ in range(10)]
            backup_codes_hashed = [
                bcrypt.hashpw(code.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                for code in backup_codes
            ]
            
            # Save
            self.config['backup_codes'] = backup_codes_hashed
            self._save_config()
            
            return True, backup_codes, None
            
        except Exception as e:
            return False, None, str(e)
    
    def reset_auth(self):
        """
        Reset authentication (delete config file)
        WARNING: This will lock out all users!
        """
        if self.config_path.exists():
            self.config_path.unlink()
        self.config = {
            'setup_completed': False,
            'username': None,
            'password_hash': None,
            'totp_secret': None,
            'backup_codes': []
        }
