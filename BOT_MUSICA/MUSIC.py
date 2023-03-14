
import youtube_dl
import pafy
import discord
from discord.ext import commands
from dotenv import load_dotenv
import os

load_dotenv()
TOKEN = os.getenv("Discord_token")

commands = commands.Bot(command_prefix = '!',intents=discord.Intents.all())

@commands.event
async def on_ready():
    print(f"{commands.user.name} is ready.")

async def search_song( amount, song, get_url=False):
    info = await commands.loop.run_in_executor(None, lambda: youtube_dl.YoutubeDL({"format" : "bestaudio", "quiet" : True}).extract_info(f"ytsearch{amount}:{song}", download=False, ie_key="YoutubeSearch"))
    if len(info["entries"]) == 0: return None

    return [entry["webpage_url"] for entry in info["entries"]] if get_url else info

async def play_song( ctx, song):
    url = pafy.new(song).getbestaudio().url
    ctx.voice_client.play(discord.PCMVolumeTransformer(discord.FFmpegPCMAudio(url)))
    ctx.voice_client.source.volume = 0.5

@commands.command()
async def leave( ctx):
    if ctx.voice_client is not None:
        return await ctx.voice_client.disconnect()

    await ctx.send("I am not connected to a voice channel.")

@commands.command()
async def play( ctx, *, song=None):

    if ctx.author.voice is None:
        return await ctx.send("You are not connected to a voice channel, please connect to the channel you want the bot to join.")

    if ctx.voice_client is not None:
        await ctx.voice_client.disconnect()

    await ctx.author.voice.channel.connect()

    if song is None:
        return await ctx.send("You must include a song to play.")

    if ctx.voice_client is None:
        return await ctx.send("I must be in a voice channel to play a song.")

    # handle song where song isn't url
    if not ("youtube.com/watch?" in song or "https://youtu.be/" in song):
        await ctx.send("Searching for song, this may take a few seconds.")

        result = await search_song(1, song, get_url=True)

        if result is None:
            return await ctx.send("Sorry, I could not find the given song, try using my search command.")

        song = result[0]
    
    await play_song(ctx, song)
    await ctx.send(f"Now playing: {song}")

@commands.command()
async def search( ctx, *, song=None):
    if song is None: return await ctx.send("You forgot to include a song to search for.")

    await ctx.send("Searching for song, this may take a few seconds.")

    info = await search_song(5, song)

    embed = discord.Embed(title=f"Results for '{song}':", description="*You can use these URL's to play an exact song if the one you want isn't the first result.*\n", colour=discord.Colour.red())
    
    amount = 0
    for entry in info["entries"]:
        embed.description += f"[{entry['title']}]({entry['webpage_url']})\n"
        amount += 1

    embed.set_footer(text=f"Displaying the first {amount} results.")
    await ctx.send(embed=embed)


@commands.command()
async def pause( ctx):
    if ctx.voice_client.is_paused():
        return await ctx.send("I am already paused.")

    ctx.voice_client.pause()
    await ctx.send("The current song has been paused.")

@commands.command()
async def resume( ctx):
    if ctx.voice_client is None:
        return await ctx.send("I am not connected to a voice channel.")

    if not ctx.voice_client.is_paused():
        return await ctx.send("I am already playing a song.")
    
    ctx.voice_client.resume()
    await ctx.send("The current song has been resumed.")

commands.run(TOKEN)
