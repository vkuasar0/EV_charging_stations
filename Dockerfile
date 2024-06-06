# Use the official Python 3.11.6 image
FROM python:3.11.6

# Set the working directory in the container
WORKDIR /app

# Copy the build_files.sh script to the container
COPY . /app/

# Make build_files.sh executable
RUN chmod +x /app/build_files.sh

# Install any dependencies required for your application
RUN pip install --no-cache-dir -r /app/requirements.txt
# Set the run command
CMD ["cd", "app"]
CMD ["python", "manage.py", "makemigrations"]
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "collectstatic"]
CMD ["gunicorn", "-b", "0.0.0.0:8000", "main.wsgi:application"]
EXPOSE 8000
