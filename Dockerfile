FROM python:3.6
ADD ./server /app
WORKDIR /app
ADD requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install gunicorn
CMD gunicorn -b 0.0.0.0:$PORT app:app
