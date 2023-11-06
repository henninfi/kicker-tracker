FROM python:3.9

WORKDIR /app
RUN pip install --upgrade pip

COPY ./requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000


# CMD ["pytest"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# docker run -d -p 8080:80 projectbackend   # run the container