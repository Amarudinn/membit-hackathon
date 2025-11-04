import os
import sys
import time
import schedule
from datetime import datetime
from membit_client import MembitClient
from gemini_client import GeminiClient
from twitter_client import TwitterClient
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import box
from colorama import init

# Suppress Gemini warnings
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['GLOG_minloglevel'] = '2'

# Initialize colorama for Windows
init()

# Load environment variables
load_dotenv()

# Initialize Rich console
console = Console()

def print_banner():
    """Print startup banner"""
    console.clear()
    banner_panel = Panel(
        "[bold cyan]🤖  TWITTER BOT - MEMBIT x GEMINI[/bold cyan]\n\n"
        "[white]Automated Web3 Tweet Generator[/white]\n"
        "[dim]Powered by Membit API & Google Gemini AI[/dim]",
        border_style="cyan",
        box=box.DOUBLE,
        padding=(1, 2)
    )
    console.print(banner_panel)
    console.print()

def create_and_post_tweet():
    """Main function to create and post tweet"""
    max_retries = int(os.getenv('MAX_RETRIES', 3))
    max_tweet_length = int(os.getenv('MAX_TWEET_LENGTH', 250))
    
    from rich.align import Align
    start_text = Align.center(
        f"[bold cyan]🚀 Starting Tweet Generation[/bold cyan]\n"
        f"[dim]⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/dim]"
    )
    start_panel = Panel(
        start_text,
        border_style="green",
        box=box.ROUNDED,
        padding=(0, 2)
    )
    console.print("\n")
    console.print(start_panel)
    
    for attempt in range(max_retries):
        try:
            if attempt > 0:
                console.print(f"\n🔄 [yellow]Retry attempt {attempt + 1}/{max_retries}[/yellow]\n")
            
            # Initialize clients
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
                transient=True
            ) as progress:
                task = progress.add_task("🔧 Initializing clients...", total=None)
                membit = MembitClient(os.getenv('MEMBIT_API_KEY'))
                gemini = GeminiClient(os.getenv('GEMINI_API_KEY'))
                twitter = TwitterClient(
                    api_key=os.getenv('TWITTER_API_KEY'),
                    api_secret=os.getenv('TWITTER_API_SECRET'),
                    access_token=os.getenv('TWITTER_ACCESS_TOKEN'),
                    access_secret=os.getenv('TWITTER_ACCESS_SECRET')
                )
            
            console.print("✅ [green]Clients initialized[/green]")
            
            # Get trending data from Membit
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
                transient=True
            ) as progress:
                task = progress.add_task("📊 Fetching trending data from Membit...", total=None)
                trending_data = membit.get_trending_topics()
            
            console.print("✅ [green]Trending data fetched[/green]")
            
            # Generate tweet using Gemini
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
                transient=True
            ) as progress:
                task = progress.add_task("🤖 Generating tweet with Gemini AI...", total=None)
                
                prompt = f"""Anda adalah seorang social media manager yang ahli. Tugas Anda adalah melihat data tren dari Membit berikut:

{trending_data}

Pilih SATU topik paling menarik terkait 'Web3', dan membuat draf tweet yang informatif dalam Bahasa Indonesia. 

PENTING: 
- Tweet MAKSIMAL {max_tweet_length} karakter (termasuk spasi dan hashtag)
- Harus singkat, padat, dan menarik
- Akhiri dengan hashtag #Web3
- Jawab HANYA dengan draf tweet, tanpa pengantar apa pun"""
                
                tweet_text = gemini.generate_content(prompt)
            
            # Clean up tweet text (remove quotes if any)
            tweet_text = tweet_text.strip().strip('"').strip("'")
            
            # Validate tweet length
            tweet_length = len(tweet_text)
            if tweet_length > 280:
                console.print(f"⚠️  [yellow]Tweet too long ({tweet_length} chars), regenerating...[/yellow]\n")
                continue  # Retry with new generation
            
            # Display tweet preview
            console.print(Panel(
                tweet_text,
                title="📝 Generated Tweet",
                border_style="green",
                box=box.ROUNDED
            ))
            
            # Show tweet stats
            stats_table = Table(show_header=False, box=None, padding=(0, 1), show_edge=False)
            stats_table.add_column(style="dim")
            stats_table.add_column()
            stats_table.add_row("📏 Length:", f"[cyan]{tweet_length}[/cyan] / 280 characters")
            stats_table.add_row("📊 Status:", "[green]✓ Valid[/green]" if tweet_length <= 280 else "[red]✗ Too long[/red]")
            console.print(stats_table)
            
            console.print("✅ [green]Tweet generated[/green]\n")
            
            # Post tweet
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
                transient=True
            ) as progress:
                task = progress.add_task("🐦 Posting to Twitter...", total=None)
                result = twitter.post_tweet(tweet_text)
            
            # Success message
            tweet_id = result.get('id')
            tweet_url = f"https://twitter.com/i/web/status/{tweet_id}"
            
            console.print()
            success_panel = Panel(
                f"[bold green]✅ TWEET POSTED SUCCESSFULLY![/bold green]\n\n"
                f"[dim]🆔 Tweet ID:[/dim] [cyan]{tweet_id}[/cyan]\n"
                f"[dim]🔗 URL:[/dim] [link={tweet_url}]{tweet_url}[/link]\n"
                f"[dim]⏰ Posted at:[/dim] [cyan]{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/cyan]",
                border_style="green",
                box=box.ROUNDED,
                padding=(1, 2)
            )
            console.print(success_panel)
            
            return  # Success, exit function
            
        except Exception as e:
            console.print(f"\n❌ [bold red]Error:[/bold red] {str(e)}\n")
            if attempt < max_retries - 1:
                console.print(f"⏳ [yellow]Retrying in 5 seconds...[/yellow]\n")
                time.sleep(5)
            else:
                console.print("🛑 [bold red]Max retries reached. Giving up.[/bold red]\n")
                return

def run_scheduler():
    """Run the scheduler every 6 hours"""
    print_banner()
    
    # Get configuration from env
    schedule_hours = int(os.getenv('SCHEDULE_HOURS', 6))
    max_retries = int(os.getenv('MAX_RETRIES', 3))
    max_tweet_length = int(os.getenv('MAX_TWEET_LENGTH', 250))
    
    # Show configuration
    config_table = Table(title="⚙️  Configuration", box=box.ROUNDED, show_header=False)
    config_table.add_row("📅 Schedule:", f"[cyan]Every {schedule_hours} hours[/cyan]")
    config_table.add_row("🔄 Auto-retry:", f"[cyan]Up to {max_retries} attempts[/cyan]")
    config_table.add_row("📏 Max length:", f"[cyan]{max_tweet_length} characters[/cyan]")
    config_table.add_row("🛑 Stop:", "[yellow]Press Ctrl+C[/yellow]")
    console.print(config_table)
    console.print()
    
    # Run immediately on start
    create_and_post_tweet()
    
    # Schedule to run every N hours
    schedule.every(schedule_hours).hours.do(create_and_post_tweet)
    
    schedule_hours = int(os.getenv('SCHEDULE_HOURS', 6))
    from rich.align import Align
    running_text = Align.center(
        f"[bold cyan]⏰ Bot is now running...[/bold cyan]\n"
        f"[dim]Next run in {schedule_hours} hours[/dim]"
    )
    running_panel = Panel(
        running_text,
        border_style="green",
        box=box.ROUNDED,
        padding=(0, 2)
    )
    console.print("\n")
    console.print(running_panel)
    console.print()
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        from rich.align import Align
        stop_text = Align.center(
            "[bold yellow]👋 Bot stopped by user[/bold yellow]\n"
            "[cyan]✨ Thank you for using Twitter Bot![/cyan]"
        )
        stop_panel = Panel(
            stop_text,
            border_style="green",
            box=box.ROUNDED,
            padding=(0, 2)
        )
        console.print("\n\n")
        console.print(stop_panel)
        console.print()

if __name__ == "__main__":
    run_scheduler()
