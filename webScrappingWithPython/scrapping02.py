##this python program gets data from SMC class info 
##website and write it in to a file. I could potentially 
##use this for a class scheduale project combine with JS
##
##

import json
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup   ##might not need this

smcUrl = "https://smccis.smc.edu/isisdoc/web_cat_sched_20201.html#AD-JUS-1"

uClient  = uReq(smcUrl)

page_html = uClient.read()

uClient.close()

page_soup = soup(page_html, "html.parser")

containers = page_soup.findAll("div", {'tabindex':"-1"})



class_name = containers[0].h3.text

list = []
for i in range(len(containers)):
    ##cleaning class name
    class_name = containers[i].h3.text
##    and "ESL" not in class_name
    if(', 'in class_name[0:18]):
        class_name =  class_name.split(', ',1)
        class_title = class_name[1]
        class_name = class_name[0]
        
    elif(': ' in class_name): 
        class_name = class_name.split(': ',1)
        class_title = class_name[1]
        class_name = class_name[0]
        ##ESL has both : and , so had to specyfy for that
    elif("ESL "in class_name):
        class_name = class_name.split(': ',1)
        class_title = class_name[1]
        class_name = class_name[0]
        
    else:
        class_title = class_name[10:-1]
        class_name = class_name[0:10]
        
        


    class_number = containers[i].findAll("p", {"class":"course"})[0]\
    .findAll("span", {"class":"course-number"})[0].contents[1]


    class_time = containers[i].findAll("p", {"class":"course"})[0]\
    .findAll("span", {"class":"time"})[0].contents[1]


    class_location = containers[i].findAll("p", {"class":"course"})\
    [0].findAll("span", {"class":"location"})[0].contents[1]

    class_instructor = containers[i].findAll("p", {"class":"course"})\
    [0].findAll("span", {"class":"instructor"})[0].contents[1]
    print(class_title)
    singleClass = {
        "class_number":class_number,
        "class_time":class_time,
        "class_location":class_location,
        "class_instructor":class_instructor,
        "class_name":class_name,
        "class_title":class_title
        }
    list.append(singleClass)

# convert into JSON:
jsonList = json.dumps(list)

# the result is a JSON string:

f = open("demofile3.txt", "w")
f.write(jsonList)
f.close()







