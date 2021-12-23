# Installation
- Install Python
- Install Database containing ontology you want to export - currently works with MySQL

<br>

# First time setup


Change directory 
```
cd C:\
```

create virtual environment (venv = virtual environment, venv_oss = folder name where packages are stored)
```
python -m venv venv_oss
```

Activate virtual environment from any directory (Windows Command Prompt)
```
c:\venv_oss\Scripts\activate.bat
```

change directory to the 'python-scripts' folder
```install requirements
python -m pip install -r requirements.txt
```

Deactivate virtual environment
```
deactivate
```

Add environment variables to your c:\venv_oss\Scripts\activate.bat file (i.e. edit with notepad and add the following variables on a new line below 'set PATH=...') 

```
set PATH=%VIRTUAL_ENV%\Scripts;%PATH%
...

set oss_url=yourendpoint
set oss_auth_basictoken=yourtoken
set mysql_url=localhost
set mysql_port=3306
set mysql_username=root
set mysql_password=yourpassword
```

<br>

# Generate documents for opensearch service from database (current MySQL)

Change directory
```
cd python-scripts
```

Activate virtual environment from any directory (Windows Command Prompt)
```
c:\venv_oss\Scripts\activate.bat
```

run script
```
python update.py
```

<br>

# Update requirements.txt (After installing new packages)

Update requirements.txt
```
python -m pip freeze > requirements.txt
```
