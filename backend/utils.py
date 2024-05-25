import openai
import os
import urllib
from pathlib import Path
from moviepy.editor import ImageSequenceClip, AudioFileClip, CompositeVideoClip


OPEN_API_KEY='sk-'
def create_scenario(usr_input):
    client = openai.OpenAI(
    api_key = OPEN_API_KEY,
)
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "write a short scenario within less than 700 characters in length according to the following subject in korean:" + usr_input},
    ]
    )
    return (response.choices[0].message.content)

def get_brand(resp):
    from openai import OpenAI

    client = openai.OpenAI(api_key = OPEN_API_KEY,)
    sent = "Draw up a brand logo that fits this scenario: " + resp
    image_name = "./images/brand.jpg"
    response = client.images.generate(
        model="dall-e-2",
        prompt=sent,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    urllib.request.urlretrieve(image_url, image_name)
    return

def get_pic(resp, subject):
    import os, shutil
    folder = './images'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
    from openai import OpenAI
    
    p = resp.split(".")
    i = 0
    while i < len(p):
        client = openai.OpenAI(api_key = OPEN_API_KEY,)
        sent = "전체 시나리오를 고려하여 " +str(i + 1)+ " 번째를 문장을 가장 잘 나타낼 수 있는 애니메이션 그림 그려줘. 시리오: " + resp + "\n주된 컨셉:" + subject
        image_name = "./images/generated_image_" + str(i) + ".jpg"
        response = client.images.generate(
            model="dall-e-3",
            prompt=sent,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url
        urllib.request.urlretrieve(image_url, image_name)
        i+=1
    return

def speech(usr_input):

    speech_file_path = Path(__file__).parent / "speech.mp3"
    response = openai.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=usr_input
    )
    response.stream_to_file(speech_file_path)

def make_video(image_folder, audio_file, output_video, fps=0.3):
    image_files = [os.path.join(image_folder, img) for img in sorted(os.listdir(image_folder)) if img.endswith(".jpg")]
    clip = ImageSequenceClip(image_files, fps=fps)
    audio = AudioFileClip(audio_file)
    video = clip.set_audio(audio)

    video = video.set_duration(audio.duration)

    video.write_videofile("output.mp4", fps=fps, audio_codec="aac", audio_bitrate="192k")

    