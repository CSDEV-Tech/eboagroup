# eboagroup

Ceci est le Backend du site de Eboagroup  
Pour pouvoir exécuter le projet il faut :

1 - Installer les packages nécessaires avec ``python -m pip install -r requirements.txt``  
2 - modifier le fichier ``boagroup_services/settings.py``, et modifier l'option ``DATABASES`` pour correspondre à votre Base de données  
3 - lancer les commandes ``python manage.py makemigrations`` et ``python manage.py migrate``  
4 - lancer la commande ``python manage.py runserver 0.0.0.0:8001``  
5 - Accéder au projet à l'adresse : http://localhost:8001