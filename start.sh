killall -s SIGKILL node
killall -s SIGKILL python
killall -s SIGKILL python3

source ~/.nvm/nvm.sh
nvm use 16
cd ~/Documents/Dev/Web/lexia-frontend/
npm start &
cd ~/Documents/Dev/Django/lexia_django/
source /mnt/storage/anaconda/etc/profile.d/conda.sh
conda activate django5
python manage.py runserver 0:8000 &
