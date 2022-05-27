# this was just going to be a batch file at first but i couldn't get it to work right, so

import os

for i in ['bcr1', 'bcr2', 'bcr3']:
	print(i)
	os.chdir(i)
	print(os.listdir())
	os.system('ffconvert png jpg')
	os.system('move *.jpg jpg')
	os.system('move *.png png')
	os.chdir('..')