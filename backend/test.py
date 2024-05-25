import os
import urllib
from pathlib import Path
from moviepy.editor import ImageSequenceClip, AudioFileClip, CompositeVideoClip

def make_video(image_folder, audio_file, output_video, fps=0.1):
    image_files = [os.path.join(image_folder, img) for img in sorted(os.listdir(image_folder)) if img.endswith(".jpg")]
    clip = ImageSequenceClip(image_files, fps=fps)
    audio = AudioFileClip(audio_file)
    video = clip.set_audio(audio)

    video = video.set_duration(audio.duration)

    video.write_videofile("output.mp4", fps=fps, audio_codec="aac", audio_bitrate="192k")
make_video("./images", "./speech.mp3", "output_video.mp4",0.3)