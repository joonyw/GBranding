import openai
import os
import urllib

OPEN_API_KEY='sk-'
def create_scenario(usr_input):
    client = openai.OpenAI(
    api_key = OPEN_API_KEY,
)
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "write a short scenario within less than 900 characters in length according to the following subject:" + usr_input},
    ]
    )
    return (response.choices[0].message.content)


def get_pic(resp):
    # from openai import OpenAI
    client = openai.OpenAI(api_key = OPEN_API_KEY,)

    response = client.images.generate(
        model="dall-e-2",
        prompt="a picture of the following scenarion: " + resp,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    urllib.request.urlretrieve(image_url, "generated_image.jpeg")