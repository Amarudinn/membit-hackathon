import secrets

# Generate a secure random secret key
secret_key = secrets.token_hex(32)

print("="*60)
print("🔑 Flask Secret Key Generator")
print("="*60)
print("\nYour SECRET_KEY:")
print(f"\n{secret_key}\n")
print("Copy this to your .env file:")
print(f"SECRET_KEY={secret_key}")
print("\n" + "="*60)
