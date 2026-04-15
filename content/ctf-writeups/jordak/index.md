---
title: "Jordak"
date: 2026-03-25
draft: false
description: "OffSec Jordak writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Jordak

## Overview

- **OS:** Linux
- **IP:** 192.168.143.109
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

simple RCE with public exploit and then privesc with env variable sudo perm.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  |
| Passwords |  |
| Usernames+Passwords |  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
22/tcp open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 76:18:f1:19:6b:29:db:da:3d:f6:7b:ab:f4:b5:63:e0 (ECDSA)
|_  256 cb:d8:d6:ef:82:77:8a:25:32:08:dd:91:96:8d:ab:7d (ED25519)
80/tcp open  http    Apache httpd 2.4.58 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-trane-info: Problem with XML parsing of /evox/about
|_http-server-header: Apache/2.4.58 (Ubuntu)
| http-robots.txt: 1 disallowed entry 
|_/
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 4 hops

```

## Dirbusting

```
┌──(kali㉿kali)-[~/Desktop/Boxes/Offsec/jordak]
└─$ feroxbuster --url http://192.168.143.109// -x php,html.txt
                                                                                                                                              
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.143.109/
 🚩  In-Scope Url          │ 192.168.143.109
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions            │ [php, html.txt]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET        9l       28w      280c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
307      GET        0l        0w        0c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       31w      277c http://192.168.143.109/css
200      GET       22l      105w     5952c http://192.168.143.109/icons/ubuntu-logo.png
301      GET        9l       28w      317c http://192.168.143.109/docs => http://192.168.143.109/docs/
301      GET        9l       28w      319c http://192.168.143.109/assets => http://192.168.143.109/assets/
200      GET      674l     5644w    35821c http://192.168.143.109/docs/gpl.txt
301      GET        9l       28w      330c http://192.168.143.109/assets/MDI-3.4.93 => http://192.168.143.109/assets/MDI-3.4.93/
301      GET        9l       28w      346c http://192.168.143.109/assets/bootstrap-datepicker-1.8.0 => http://192.168.143.109/assets/bootstrap-datepicker-1.8.0/
301      GET        9l       28w      338c http://192.168.143.109/assets/fullcalendar-2.8.0 => http://192.168.143.109/assets/fullcalendar-2.8.0/
200      GET      117l      432w     7887c http://192.168.143.109/assets/images/logo_complex.svg
200      GET       57l      369w    22401c http://192.168.143.109/assets/images/logo_simple.png
200      GET        3l       12w      342c http://192.168.143.109/assets/images/morning.png
200      GET        3l        9w      516c http://192.168.143.109/assets/images/leave_1d_MM.png
200      GET        7l       14w      584c http://192.168.143.109/assets/images/leave_2d_none.png
200      GET       15l       62w     3732c http://192.168.143.109/assets/images/application.png
200      GET        4l        9w      329c http://192.168.143.109/assets/images/leave_1d_MA.png
200      GET        3l       18w      634c http://192.168.143.109/assets/images/leave_2d_AA.png
200      GET        3l        8w      598c http://192.168.143.109/assets/images/leave_2d_MM.png
200      GET        4l       14w      490c http://192.168.143.109/assets/images/leave_2d_MA.png
200      GET        3l        7w      205c http://192.168.143.109/assets/images/day.png
200      GET       36l      182w     5310c http://192.168.143.109/assets/images/loading.gif
200      GET        3l        8w      467c http://192.168.143.109/assets/images/leave_1d_AA.png
200      GET        4l       10w      433c http://192.168.143.109/assets/images/leave_none.png
200      GET       10l       28w     1567c http://192.168.143.109/assets/images/brand.png
200      GET       52l      256w    23241c http://192.168.143.109/assets/bootstrap/img/glyphicons-halflings.png
200      GET       23l      151w    16783c http://192.168.143.109/assets/bootstrap/img/glyphicons-halflings-white.png
404      GET        9l       31w      277c http://192.168.143.109/js
200      GET      363l      961w    10671c http://192.168.143.109/
200      GET       51l      381w     2547c http://192.168.143.109/docs/license.txt
404      GET        9l       31w      277c http://192.168.143.109/css.php
301      GET        9l       28w      333c http://192.168.143.109/assets/select2-4.0.5 => http://192.168.143.109/assets/select2-4.0.5/
301      GET        9l       28w      337c http://192.168.143.109/assets/swagger-ui-3.20.9 => http://192.168.143.109/assets/swagger-ui-3.20.9/
301      GET        9l       28w      333c http://192.168.143.109/assets/jsTree-3.3.10 => http://192.168.143.109/assets/jsTree-3.3.10/
200      GET      163l     1114w     8433c http://192.168.143.109/docs/install/README.md
200      GET       38l      226w    21693c http://192.168.143.109/docs/configuration.xlsx
404      GET        9l       31w      277c http://192.168.143.109/css.html.txt
404      GET        9l       31w      277c http://192.168.143.109/js.php
200      GET        7l       65w     4964c http://192.168.143.109/assets/js/toe.min.js
200      GET        7l      315w    10605c http://192.168.143.109/assets/js/clipboard-1.6.1.min.js
200      GET        6l      153w     6197c http://192.168.143.109/assets/js/bootbox.min.js
200      GET       62l      175w     1607c http://192.168.143.109/docs/install/lighttpd/lighttpd.conf
200      GET        6l      271w     9977c http://192.168.143.109/assets/js/bootbox-4.4.0.min.js
200      GET      114l      351w     4116c http://192.168.143.109/docs/install/nginx/default
301      GET        9l       28w      346c http://192.168.143.109/assets/datatable/ColReorder-1.3.1 => http://192.168.143.109/assets/datatable/ColReorder-1.3.1/
301      GET        9l       28w      344c http://192.168.143.109/assets/datatable/pdfmake-0.1.18 => http://192.168.143.109/assets/datatable/pdfmake-0.1.18/
301      GET        9l       28w      343c http://192.168.143.109/assets/datatable/Buttons-1.1.2 => http://192.168.143.109/assets/datatable/Buttons-1.1.2/
301      GET        9l       28w      347c http://192.168.143.109/assets/datatable/FixedHeader-3.1.1 => http://192.168.143.109/assets/datatable/FixedHeader-3.1.1/
301      GET        9l       28w      342c http://192.168.143.109/assets/datatable/Select-1.1.2 => http://192.168.143.109/assets/datatable/Select-1.1.2/
301      GET        9l       28w      341c http://192.168.143.109/assets/datatable/JSZip-2.5.0 => http://192.168.143.109/assets/datatable/JSZip-2.5.0/
301      GET        9l       28w      346c http://192.168.143.109/assets/datatable/Responsive-2.0.2 => http://192.168.143.109/assets/datatable/Responsive-2.0.2/
301      GET        9l       28w      344c http://192.168.143.109/assets/datatable/KeyTable-2.1.1 => http://192.168.143.109/assets/datatable/KeyTable-2.1.1/
200      GET      181l      557w     3463c http://192.168.143.109/assets/ckeditor/build-config.js
200      GET        2l      309w    14073c http://192.168.143.109/assets/js/modernizr.min.js
200      GET     1158l     3638w    37853c http://192.168.143.109/assets/datatable/datatables.css
200      GET      105l      888w    51866c http://192.168.143.109/assets/js/jsencrypt.min.js
200      GET        4l     1338w    85582c http://192.168.143.109/assets/js/jquery-2.2.4.min.js
200      GET       23l       53w      998c http://192.168.143.109/docs/install/iis7/web.config
200      GET       10l       82w     3187c http://192.168.143.109/assets/ckeditor/adapters/jquery.js
200      GET     1420l    11667w    76251c http://192.168.143.109/assets/ckeditor/LICENSE.md
200      GET        5l      907w    16916c http://192.168.143.109/assets/ckeditor/lang/mk.js
200      GET        5l      901w    17292c http://192.168.143.109/assets/ckeditor/lang/id.js
200      GET        5l     1133w    19215c http://192.168.143.109/assets/ckeditor/lang/pt-br.js
200      GET        5l     1058w    19626c http://192.168.143.109/assets/ckeditor/lang/ro.js
200      GET        5l      155w    16602c http://192.168.143.109/assets/ckeditor/lang/zh-cn.js
200      GET        5l      547w    28243c http://192.168.143.109/assets/ckeditor/lang/th.js
200      GET        5l      899w    17043c http://192.168.143.109/assets/ckeditor/lang/bs.js
200      GET        5l      890w    22173c http://192.168.143.109/assets/ckeditor/lang/ar.js
200      GET        5l      166w    20884c http://192.168.143.109/assets/ckeditor/lang/ja.js
200      GET        5l      813w    17534c http://192.168.143.109/assets/ckeditor/lang/hr.js
200      GET        5l     1595w    20948c http://192.168.143.109/assets/ckeditor/lang/vi.js
200      GET        5l      908w    25523c http://192.168.143.109/assets/ckeditor/lang/ku.js
200      GET        5l      785w    17052c http://192.168.143.109/assets/ckeditor/lang/af.js
200      GET        5l     1068w    18896c http://192.168.143.109/assets/ckeditor/lang/fr-ca.js
200      GET        5l      709w    17727c http://192.168.143.109/assets/ckeditor/lang/et.js
200      GET        5l      920w    17313c http://192.168.143.109/assets/ckeditor/lang/ms.js
200      GET        5l      900w    18309c http://192.168.143.109/assets/ckeditor/lang/eo.js
200      GET        5l      867w    17843c http://192.168.143.109/assets/ckeditor/lang/sl.js
200      GET        5l      908w    16914c http://192.168.143.109/assets/ckeditor/lang/en-gb.js
200      GET        5l      825w    18393c http://192.168.143.109/assets/ckeditor/lang/eu.js
200      GET        5l      787w    19269c http://192.168.143.109/assets/ckeditor/lang/hu.js
200      GET        5l      919w    17481c http://192.168.143.109/assets/ckeditor/lang/sr-latn.js
200      GET        5l      789w    17574c http://192.168.143.109/assets/ckeditor/lang/sv.js
200      GET        5l      906w    16899c http://192.168.143.109/assets/ckeditor/lang/en-ca.js
200      GET        5l     1191w    19323c http://192.168.143.109/assets/ckeditor/lang/sq.js
200      GET        5l     1089w    18981c http://192.168.143.109/assets/ckeditor/lang/es.js
200      GET        5l      813w    17358c http://192.168.143.109/assets/ckeditor/lang/nb.js
200      GET        5l     1049w    23528c http://192.168.143.109/assets/ckeditor/lang/fa.js
200      GET        5l      887w    17535c http://192.168.143.109/assets/ckeditor/lang/is.js
200      GET        5l      793w    33198c http://192.168.143.109/assets/ckeditor/lang/ka.js
200      GET        5l      992w    27731c http://192.168.143.109/assets/ckeditor/lang/el.js
200      GET        5l      899w    24523c http://192.168.143.109/assets/ckeditor/lang/si.js
200      GET        5l      911w    26028c http://192.168.143.109/assets/ckeditor/lang/ug.js
200      GET        5l      790w    18981c http://192.168.143.109/assets/ckeditor/lang/lv.js
200      GET        5l      918w    21362c http://192.168.143.109/assets/ckeditor/lang/sr.js
200      GET        5l     1134w    18967c http://192.168.143.109/assets/ckeditor/lang/gl.js
200      GET        5l      977w    24158c http://192.168.143.109/assets/ckeditor/lang/hi.js
200      GET        5l      810w    17326c http://192.168.143.109/assets/ckeditor/lang/no.js
200      GET        5l      760w    18556c http://192.168.143.109/assets/ckeditor/lang/de.js
200      GET        5l      973w    17572c http://192.168.143.109/assets/ckeditor/lang/cy.js
200      GET        5l      960w    22387c http://192.168.143.109/assets/ckeditor/lang/mn.js
200      GET        5l     1138w    18853c http://192.168.143.109/assets/ckeditor/lang/ca.js
200      GET       80l      470w    37230c http://192.168.143.109/assets/ckeditor/plugins/icons.png
200      GET        5l      873w    21668c http://192.168.143.109/assets/ckeditor/lang/he.js
200      GET       11l      426w    34147c http://192.168.143.109/assets/js/jquery.form-validator.min.js
200      GET        5l      873w    27264c http://192.168.143.109/assets/ckeditor/lang/ru.js
200      GET      111l      531w     3595c http://192.168.143.109/assets/ckeditor/styles.js
200      GET      298l     1673w   122054c http://192.168.143.109/assets/ckeditor/plugins/icons_hidpi.png
200      GET       92l      664w     4393c http://192.168.143.109/assets/fonts/LICENSE_OFL.txt
200      GET       10l       45w      342c http://192.168.143.109/assets/ckeditor/config.js
200      GET        8l       44w     3429c http://192.168.143.109/assets/images/date_error.png
200      GET        3l       10w      386c http://192.168.143.109/assets/images/afternoon.png
200      GET       97l      251w     4425c http://192.168.143.109/assets/images/logo_simple.svg
200      GET       12l       49w     2122c http://192.168.143.109/assets/images/logo.png
200      GET        3l       21w      555c http://192.168.143.109/assets/images/leave_2d_AM.png
200      GET      499l     2578w   155269c http://192.168.143.109/assets/fonts/NotoSerifKhmer-Regular.ttf
200      GET      211l     1422w    66639c http://192.168.143.109/assets/fonts/NotoSansKhmer-Regular.ttf
200      GET       23l       55w      871c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sr-SR.js
200      GET       23l       56w      916c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-eo.js
200      GET       23l       52w      936c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-eu.js
200      GET       23l       55w     1006c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-zh-CN.js
200      GET       23l       77w      919c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-af.js
200      GET       23l       57w      913c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sv.js
200      GET       23l       58w     1222c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-el.js
200      GET       23l       56w      940c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-pl.js
200      GET       23l       55w      892c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-hr.js
200      GET       23l       63w      910c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sq.js
200      GET       23l       94w      971c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-hu.js
200      GET       23l       80w     1459c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ml.js
200      GET       23l       55w     1000c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-zh-TW.js
200      GET       23l       58w     1039c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-he.js
200      GET       24l       58w     1148c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-bg.js
200      GET       23l       61w      944c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-az.js
200      GET       23l       56w      925c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ja.js
200      GET       23l       57w      913c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-da.js
200      GET       23l       56w      911c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-no.js
200      GET       59l      107w     1223c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fa.js
200      GET       23l       97w     1230c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ar-DZ.js
200      GET       23l       56w      904c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-de.js
200      GET       23l       59w      914c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ms.js
200      GET       26l       88w     1015c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ro.js
200      GET       23l       55w      897c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ca.js
200      GET       24l       64w     1207c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-uk.js
200      GET       23l       72w     1353c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-km.js
200      GET       23l       81w      974c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-et.js
200      GET       23l       93w      980c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fr-CH.js
200      GET        2l       73w     2510c http://192.168.143.109/assets/js/html5shiv.min.js
200      GET       22l       57w      918c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-nb.js
200      GET       24l       76w      967c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sl.js
200      GET       23l       58w     1519c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ta.js
200      GET       23l       57w      905c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-id.js
200      GET       22l       57w      915c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-nn.js
200      GET        1l       20w     2559c http://192.168.143.109/assets/js/context.menu.min.js
301      GET        9l       28w      346c http://192.168.143.109/assets/datatable/RowReorder-1.1.1 => http://192.168.143.109/assets/datatable/RowReorder-1.1.1/
301      GET        9l       28w      344c http://192.168.143.109/assets/datatable/Scroller-1.4.1 => http://192.168.143.109/assets/datatable/Scroller-1.4.1/
200      GET        3l       40w     1714c http://192.168.143.109/assets/js/js.state-2.2.0.min.js
200      GET       34l       67w      749c http://192.168.143.109/assets/font-awesome/scss/_animated.scss
200      GET        6l       15w      126c http://192.168.143.109/assets/font-awesome/scss/_fixed-width.scss
200      GET       12l       47w      471c http://192.168.143.109/assets/font-awesome/scss/_core.scss
200      GET       25l       71w      617c http://192.168.143.109/assets/font-awesome/scss/_bordered-pulled.scss
200      GET       15l       37w      798c http://192.168.143.109/assets/font-awesome/scss/_path.scss
200      GET       20l       47w      502c http://192.168.143.109/assets/font-awesome/scss/_stacked.scss
200      GET       13l       50w      388c http://192.168.143.109/assets/font-awesome/scss/_larger.scss
301      GET        9l       28w      348c http://192.168.143.109/assets/datatable/DataTables-1.10.11 => http://192.168.143.109/assets/datatable/DataTables-1.10.11/
200      GET       17l       47w      422c http://192.168.143.109/assets/font-awesome/scss/font-awesome.scss
301      GET        9l       28w      348c http://192.168.143.109/assets/datatable/FixedColumns-3.2.1 => http://192.168.143.109/assets/datatable/FixedColumns-3.2.1/
200      GET       20l       59w      692c http://192.168.143.109/assets/font-awesome/scss/_rotated-flipped.scss
200      GET       36l      272w    15270c http://192.168.143.109/assets/js/require-2.1.11.js
200      GET        6l       15w      125c http://192.168.143.109/assets/font-awesome/less/fixed-width.less
200      GET       25l       71w      610c http://192.168.143.109/assets/font-awesome/less/bordered-pulled.less
200      GET      688l     1380w    19891c http://192.168.143.109/assets/font-awesome/less/variables.less
200      GET       26l       74w      952c http://192.168.143.109/assets/font-awesome/less/mixins.less
200      GET       17l       47w      482c http://192.168.143.109/assets/font-awesome/less/font-awesome.less
200      GET       15l       37w      785c http://192.168.143.109/assets/font-awesome/less/path.less
200      GET       12l       47w      464c http://192.168.143.109/assets/font-awesome/less/core.less
200      GET       20l       54w      642c http://192.168.143.109/assets/font-awesome/less/rotated-flipped.less
200      GET       34l       67w      747c http://192.168.143.109/assets/font-awesome/less/animated.less
200      GET       19l       44w      396c http://192.168.143.109/assets/font-awesome/less/list.less
200      GET        9l      849w   126824c http://192.168.143.109/assets/js/jquery-ui.custom.min.js
200      GET     1645l     4150w    71714c http://192.168.143.109/assets/js/i18n/jquery-ui-i18n.js
200      GET       21l       56w      926c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-rm.js
200      GET       23l      129w     1117c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-vi.js
200      GET       21l       59w     1435c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ka.js
200      GET       23l      128w     1320c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ar.js
200      GET       23l       56w      935c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-it.js
200      GET       23l       55w     1197c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-hy.js
200      GET       23l       56w      968c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fi.js
200      GET       23l       57w      906c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-tr.js
200      GET       23l       55w     1080c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-mk.js
200      GET       23l       79w      922c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-en-NZ.js
200      GET       23l       56w      965c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-lv.js
200      GET       23l       56w      984c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-lt.js
200      GET       22l       49w      890c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-pt.js
200      GET       23l       85w     1336c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-hi.js
200      GET       20l       47w      496c http://192.168.143.109/assets/font-awesome/less/stacked.less
200      GET       13l       50w      383c http://192.168.143.109/assets/font-awesome/less/larger.less
200      GET       23l       56w     1169c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-be.js
200      GET       23l       55w      913c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-gl.js
200      GET       23l       60w      969c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-is.js
200      GET       23l       90w      936c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fr-CA.js
200      GET       23l       94w      941c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-nl-BE.js
200      GET       23l       55w     1004c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-zh-HK.js
200      GET       23l       55w      867c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-bs.js
200      GET       23l       78w      957c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-lb.js
200      GET       23l       55w     1060c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sr.js
200      GET       23l       57w     1097c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-tj.js
200      GET     1921l     8093w   326329c http://192.168.143.109/assets/fonts/NotoNaskhArabic-Regular.ttf
200      GET       23l       57w      934c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ko.js
200      GET       42l     1030w    31646c http://192.168.143.109/assets/datatable/datatables.min.css
200      GET     2026l     3430w    34344c http://192.168.143.109/assets/font-awesome/css/font-awesome.css
200      GET      688l     1389w    19972c http://192.168.143.109/assets/font-awesome/scss/_variables.scss
200      GET      677l     3038w    43840c http://192.168.143.109/assets/font-awesome/scss/_icons.scss
200      GET       14l     1142w    76998c http://192.168.143.109/assets/js/jszip.min.js
200      GET        4l       63w    26715c http://192.168.143.109/assets/font-awesome/css/font-awesome.min.css
200      GET        9l      246w    16849c http://192.168.143.109/assets/bootstrap/css/bootstrap-responsive.min.css
200      GET     6167l    13698w   133510c http://192.168.143.109/assets/bootstrap/css/bootstrap.css
200      GET     1109l     2160w    23211c http://192.168.143.109/assets/bootstrap/css/bootstrap-responsive.css
200      GET      291l     1848w   122914c http://192.168.143.109/assets/font-awesome/fonts/fontawesome-webfont.eot
200      GET      199l     1631w    76383c http://192.168.143.109/assets/templates/import-entitlements.xls
200      GET        5l     2891w   151147c http://192.168.143.109/assets/js/d3.min.js
200      GET     2280l     6370w    64163c http://192.168.143.109/assets/bootstrap/js/bootstrap.js
200      GET        7l      574w    30035c http://192.168.143.109/assets/css/flick/jquery-ui.custom.min.css
200      GET       74l     5380w   191346c http://192.168.143.109/assets/js/moment-with-locales.min.js
200      GET      677l     3038w    43166c http://192.168.143.109/assets/font-awesome/less/icons.less
200      GET      305l     1804w   146623c http://192.168.143.109/assets/font-awesome/fonts/fontawesome-webfont.woff
200      GET        9l     2493w   106015c http://192.168.143.109/assets/bootstrap/css/bootstrap.min.css
200      GET      277l     1470w   116553c http://192.168.143.109/assets/font-awesome/fonts/fontawesome-webfont.woff2
200      GET     2106l     3938w   202508c http://192.168.143.109/assets/font-awesome/fonts/FontAwesome.otf
200      GET     1211l     4999w   177472c http://192.168.143.109/assets/font-awesome/fonts/fontawesome-webfont.ttf
200      GET      960l    10550w   123614c http://192.168.143.109/assets/ckeditor/CHANGES.md
404      GET        9l       31w      277c http://192.168.143.109/js-lib
200      GET       39l      189w     1383c http://192.168.143.109/assets/ckeditor/README.md
404      GET        9l       31w      277c http://192.168.143.109/js-lib.php
404      GET        9l       31w      277c http://192.168.143.109/js.html.txt
404      GET        9l       31w      277c http://192.168.143.109/js-lib.html.txt
200      GET      594l     2650w    28719c http://192.168.143.109/assets/css/jorani-0.6.6.css
200      GET        5l     1020w    24415c http://192.168.143.109/assets/ckeditor/lang/bg.js
200      GET        5l      817w    18468c http://192.168.143.109/assets/ckeditor/lang/tr.js
200      GET        5l      906w    16899c http://192.168.143.109/assets/ckeditor/lang/en-au.js
200      GET        5l      839w    18111c http://192.168.143.109/assets/ckeditor/lang/fo.js
200      GET        5l      886w    18908c http://192.168.143.109/assets/ckeditor/lang/pl.js
200      GET        5l      726w    18440c http://192.168.143.109/assets/ckeditor/lang/ko.js
200      GET        5l      909w    22631c http://192.168.143.109/assets/ckeditor/lang/tt.js
200      GET        5l      961w    29750c http://192.168.143.109/assets/ckeditor/lang/gu.js
200      GET      185l     1605w    75819c http://192.168.143.109/assets/templates/import-users.xls
200      GET        5l      257w    32800c http://192.168.143.109/assets/ckeditor/lang/km.js
200      GET        5l      798w    18860c http://192.168.143.109/assets/ckeditor/lang/lt.js
200      GET        5l      648w    18177c http://192.168.143.109/assets/ckeditor/lang/fi.js
200      GET        5l      877w    19025c http://192.168.143.109/assets/ckeditor/lang/sk.js
200      GET        5l     1105w    18869c http://192.168.143.109/assets/ckeditor/lang/pt.js
200      GET        5l      907w    16913c http://192.168.143.109/assets/ckeditor/lang/en.js
200      GET        5l      183w    16540c http://192.168.143.109/assets/ckeditor/lang/zh.js
200      GET        5l      862w    26592c http://192.168.143.109/assets/ckeditor/lang/uk.js
200      GET        5l      989w    18696c http://192.168.143.109/assets/ckeditor/lang/it.js
200      GET        5l      974w    23331c http://192.168.143.109/assets/ckeditor/lang/bn.js
200      GET        5l      844w    18143c http://192.168.143.109/assets/ckeditor/lang/nl.js
200      GET   103366l   319009w  3072627c http://192.168.143.109/assets/datatable/datatables.js
200      GET     1067l     7446w   556584c http://192.168.143.109/assets/ckeditor/ckeditor.js
200      GET      132l      253w     1967c http://192.168.143.109/assets/ckeditor/contents.css
200      GET      640l    51812w   356620c http://192.168.143.109/assets/font-awesome/fonts/fontawesome-webfont.svg
301      GET        9l       28w      316c http://192.168.143.109/sql => http://192.168.143.109/sql/
200      GET        5l     1154w    19382c http://192.168.143.109/assets/ckeditor/lang/fr.js
200      GET       33l      257w     2381c http://192.168.143.109/sql/patch_to_0.3.0.sql
200      GET       57l      184w     1771c http://192.168.143.109/sql/GetFamilyTree_mysql5.6.sql
200      GET       86l      426w     3651c http://192.168.143.109/sql/patch_to_0.5.0.sql
200      GET      174l      672w     6075c http://192.168.143.109/sql/patch_to_0.2.0.sql
200      GET      165l      794w     5904c http://192.168.143.109/sql/patch_to_0.6.0.sql
200      GET      249l     1174w    12446c http://192.168.143.109/sql/patch_to_1.0.0.sql
200      GET      145l      515w     4204c http://192.168.143.109/sql/functions_only.sql
200      GET       28l      148w     1243c http://192.168.143.109/sql/patch_to_0.4.0.sql
200      GET       59l      256w     3498c http://192.168.143.109/sql/anonymize.sql
200      GET      525l     2799w    23079c http://192.168.143.109/sql/jorani.sql
200      GET      523l     9840w  1270493c http://192.168.143.109/assets/datatable/datatables.min.js
200      GET        5l      854w    18780c http://192.168.143.109/assets/ckeditor/lang/cs.js
200      GET        5l      821w    17813c http://192.168.143.109/assets/ckeditor/lang/da.js
200      GET       23l       68w      946c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-cs.js
200      GET       23l       55w     1297c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-th.js
200      GET       23l       56w      928c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-sk.js
200      GET       23l       78w      920c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-en-AU.js
200      GET       23l       95w      945c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-nl.js
200      GET       24l       70w     1133c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ky.js
200      GET       23l       84w      927c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-cy-GB.js
200      GET       25l       94w     1067c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fr.js
200      GET       23l       57w      968c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-pt-BR.js
200      GET       23l       57w     1140c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-kk.js
200      GET       23l       57w      911c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-es.js
200      GET       23l       59w      941c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-fo.js
200      GET       23l       76w      897c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-en-GB.js
200      GET       23l       57w     1140c http://192.168.143.109/assets/js/i18n/jquery.ui.datepicker-ru.js
200      GET       19l       44w      397c http://192.168.143.109/assets/font-awesome/scss/_list.scss
200      GET       26l       76w      972c http://192.168.143.109/assets/font-awesome/scss/_mixins.scss
200      GET      294l      983w    12780c http://192.168.143.109/assets/js/lms/leave.edit-0.7.0.js
200      GET        6l      315w    28636c http://192.168.143.109/assets/bootstrap/js/bootstrap.min.js
301      GET        9l       28w      318c http://192.168.143.109/tests => http://192.168.143.109/tests/
200      GET       32l      282w     1780c http://192.168.143.109/tests/load/README.md
200      GET     1198l     2364w    68705c http://192.168.143.109/tests/load/lms.jmx
200      GET        2l        4w       23c http://192.168.143.109/tests/rest/api.php
200      GET     1397l     2815w    82925c http://192.168.143.109/tests/load/benchmark.jmx
200      GET        3l        6w       35c http://192.168.143.109/tests/rest/api3.php
200      GET        2l        3w       14c http://192.168.143.109/tests/rest/api2.php
404      GET        9l       31w      277c http://192.168.143.109/jscripts
404      GET        9l       31w      277c http://192.168.143.109/jscripts.php
404      GET        9l       31w      277c http://192.168.143.109/jscripts.html.txt
200      GET     5320l    21325w  1903129c http://192.168.143.109/tests/load/Dataset.xlsx
404      GET        9l       31w      277c http://192.168.143.109/jscript
404      GET        9l       31w      277c http://192.168.143.109/jscript.php
404      GET        9l       31w      277c http://192.168.143.109/jscript.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jsp
404      GET        9l       31w      277c http://192.168.143.109/jsp.php
404      GET        9l       31w      277c http://192.168.143.109/jsp.html.txt
404      GET        9l       31w      277c http://192.168.143.109/json
404      GET        9l       31w      277c http://192.168.143.109/json.php
404      GET        9l       31w      277c http://192.168.143.109/json.html.txt
301      GET        9l       28w      319c http://192.168.143.109/vendor => http://192.168.143.109/vendor/
200      GET       14l       45w      362c http://192.168.143.109/vendor/bin/openapi
200      GET        4l        9w      127c http://192.168.143.109/vendor/bin/generate_vcards.bat
200      GET        4l        9w      119c http://192.168.143.109/vendor/bin/vobject.bat
200      GET       14l       45w      364c http://192.168.143.109/vendor/bin/generate_vcards
200      GET        4l        9w      125c http://192.168.143.109/vendor/bin/openapi.bat
200      GET       14l       45w      356c http://192.168.143.109/vendor/bin/vobject
200      GET        4l        9w      130c http://192.168.143.109/vendor/bin/yaml-lint.bat
200      GET       14l       45w      367c http://192.168.143.109/vendor/bin/yaml-lint
200      GET       21l      168w     1070c http://192.168.143.109/vendor/composer/LICENSE
200      GET       30l      558w     5184c http://192.168.143.109/vendor/phpmailer/phpmailer/SECURITY.md
200      GET        7l       11w      215c http://192.168.143.109/vendor/phpmailer/phpmailer/get_oauth_token.php
200      GET        1l        1w        5c http://192.168.143.109/vendor/phpmailer/phpmailer/VERSION
200      GET       46l      311w     2092c http://192.168.143.109/vendor/phpmailer/phpmailer/COMMITMENT
200      GET       58l      146w     1702c http://192.168.143.109/vendor/phpmailer/phpmailer/composer.json
200      GET     2563l     4778w    82041c http://192.168.143.109/vendor/composer/installed.json
200      GET       39l      276w     1902c http://192.168.143.109/vendor/league/oauth2-client/CONTRIBUTING.md
200      GET       20l       41w      571c http://192.168.143.109/vendor/league/oauth2-client/CREDITS.md
200      GET       76l      461w     3364c http://192.168.143.109/vendor/league/oauth2-client/CODE_OF_CONDUCT.md
200      GET      335l     1456w    11431c http://192.168.143.109/vendor/league/oauth2-client/CHANGELOG.md
200      GET       21l      172w     1106c http://192.168.143.109/vendor/league/oauth2-client/LICENSE
200      GET       96l      575w     4237c http://192.168.143.109/vendor/league/oauth2-client/README.PROVIDER-GUIDE.md
200      GET       59l      100w     1414c http://192.168.143.109/vendor/league/oauth2-client/composer.json
200      GET       18l       43w      387c http://192.168.143.109/vendor/guzzlehttp/guzzle/Dockerfile
200      GET       19l      169w     1116c http://192.168.143.109/vendor/guzzlehttp/guzzle/LICENSE
200      GET       59l      113w     1347c http://192.168.143.109/vendor/guzzlehttp/guzzle/composer.json
200      GET       27l       53w      635c http://192.168.143.109/vendor/psr/http-client/composer.json
200      GET       12l       54w      548c http://192.168.143.109/vendor/psr/http-client/README.md
200      GET       23l       58w      377c http://192.168.143.109/vendor/psr/http-client/CHANGELOG.md
200      GET       90l      359w     3642c http://192.168.143.109/vendor/guzzlehttp/guzzle/README.md
200      GET       21l      168w     1064c http://192.168.143.109/vendor/psr/http-factory/LICENSE
200      GET       19l      169w     1085c http://192.168.143.109/vendor/psr/http-client/LICENSE
200      GET       41l       96w     1159c http://192.168.143.109/vendor/doctrine/lexer/composer.json
200      GET        9l       34w      352c http://192.168.143.109/vendor/doctrine/lexer/README.md
200      GET       10l       40w      429c http://192.168.143.109/vendor/psr/http-factory/README.md
200      GET       35l       57w      700c http://192.168.143.109/vendor/psr/http-factory/composer.json
200      GET       19l      167w     1065c http://192.168.143.109/vendor/doctrine/lexer/LICENSE
200      GET       26l       51w      621c http://192.168.143.109/vendor/psr/http-message/composer.json
200      GET       19l      169w     1085c http://192.168.143.109/vendor/psr/http-message/LICENSE
200      GET       13l       49w      358c http://192.168.143.109/vendor/psr/http-message/README.md
200      GET       36l      142w     1075c http://192.168.143.109/vendor/psr/http-message/CHANGELOG.md
200      GET      270l      996w     7634c http://192.168.143.109/vendor/guzzlehttp/psr7/CHANGELOG.md
200      GET       49l      112w     1353c http://192.168.143.109/vendor/guzzlehttp/psr7/composer.json
200      GET       21l      191w     1137c http://192.168.143.109/vendor/psr/simple-cache/LICENSE.md
200      GET       17l       36w      408c http://192.168.143.109/vendor/jpgraph/jpgraph/composer.json
200      GET       19l      169w     1111c http://192.168.143.109/vendor/guzzlehttp/psr7/LICENSE
200      GET      132l      504w     3955c http://192.168.143.109/vendor/myclabs/php-enum/README.md
200      GET       25l      172w     1109c http://192.168.143.109/vendor/markbaker/complex/license.md
200      GET        5l       26w      207c http://192.168.143.109/vendor/jpgraph/jpgraph/README.md
200      GET       25l       48w      552c http://192.168.143.109/vendor/psr/simple-cache/composer.json
200      GET        8l       57w      563c http://192.168.143.109/vendor/psr/simple-cache/README.md
200      GET       84l      151w     3390c http://192.168.143.109/vendor/markbaker/complex/composer.json
200      GET      221l     1804w    16383c http://192.168.143.109/vendor/phpmailer/phpmailer/README.md
200      GET       11l       35w      279c http://192.168.143.109/vendor/myclabs/php-enum/SECURITY.md
200      GET      156l      607w     4542c http://192.168.143.109/vendor/markbaker/complex/README.md
200      GET       33l       59w      781c http://192.168.143.109/vendor/myclabs/php-enum/composer.json
200      GET       20l       29w      582c http://192.168.143.109/vendor/myclabs/php-enum/psalm.xml
200      GET      502l     4372w    26529c http://192.168.143.109/vendor/phpmailer/phpmailer/LICENSE
200      GET       18l      171w     1076c http://192.168.143.109/vendor/myclabs/php-enum/LICENSE
200      GET      270l     1589w    14783c http://192.168.143.109/vendor/league/oauth2-client/README.md
200      GET       26l       48w      465c http://192.168.143.109/vendor/ralouphie/getallheaders/composer.json
200      GET       27l       51w     1088c http://192.168.143.109/vendor/ralouphie/getallheaders/README.md
200      GET       19l      167w     1065c http://192.168.143.109/vendor/symfony/polyfill-ctype/LICENSE
200      GET       12l       40w      352c http://192.168.143.109/vendor/symfony/polyfill-ctype/README.md
200      GET       44l       82w     1067c http://192.168.143.109/vendor/league/oauth2-google/composer.json
200      GET       21l      171w     1080c http://192.168.143.109/vendor/ralouphie/getallheaders/LICENSE
200      GET       22l      172w     1098c http://192.168.143.109/vendor/paragonie/random_compat/LICENSE
200      GET       19l       36w      596c http://192.168.143.109/vendor/paragonie/random_compat/psalm.xml
200      GET      165l      616w     3990c http://192.168.143.109/vendor/markbaker/matrix/README.md
200      GET       25l       82w      556c http://192.168.143.109/vendor/maennchen/zipstream-php/CONTRIBUTING.md
200      GET       28l      100w     1106c http://192.168.143.109/vendor/symfony/polyfill-php70/README.md
200      GET       86l      276w     2730c http://192.168.143.109/vendor/phpseclib/phpseclib/README.md
200      GET       27l       88w      791c http://192.168.143.109/vendor/phpseclib/phpseclib/appveyor.yml
200      GET       55l      184w     1506c http://192.168.143.109/vendor/sabre/uri/README.md
200      GET       21l       38w      404c http://192.168.143.109/vendor/robrichards/xmlseclibs/composer.json
200      GET       36l       87w     1121c http://192.168.143.109/vendor/bshaffer/oauth2-server-php/composer.json
200      GET       21l      170w     1074c http://192.168.143.109/vendor/bshaffer/oauth2-server-php/LICENSE
200      GET     1203l     5720w    50768c http://192.168.143.109/vendor/guzzlehttp/guzzle/UPGRADING.md
200      GET       38l       80w      988c http://192.168.143.109/vendor/symfony/polyfill-ctype/composer.json
200      GET     1338l    10777w    78813c http://192.168.143.109/vendor/guzzlehttp/guzzle/CHANGELOG.md
200      GET      809l     3320w    26641c http://192.168.143.109/vendor/guzzlehttp/psr7/README.md
200      GET      190l      667w     6597c http://192.168.143.109/vendor/league/oauth2-google/README.md
200      GET       42l      257w     1750c http://192.168.143.109/vendor/league/oauth2-google/CONTRIBUTING.md
200      GET       21l      172w     1100c http://192.168.143.109/vendor/league/oauth2-google/LICENSE
200      GET       28l       42w      921c http://192.168.143.109/vendor/league/oauth2-google/phpunit.xml.dist
200      GET       17l       27w      371c http://192.168.143.109/vendor/markbaker/matrix/infection.json.dist
200      GET       25l      172w     1109c http://192.168.143.109/vendor/markbaker/matrix/license.md
200      GET       83l      163w     3545c http://192.168.143.109/vendor/markbaker/matrix/composer.json
200      GET        1l       11w       69c http://192.168.143.109/vendor/markbaker/matrix/buildPhar.php
200      GET        5l       19w      226c http://192.168.143.109/vendor/markbaker/matrix/phpstan.neon
200      GET       34l       77w      868c http://192.168.143.109/vendor/paragonie/random_compat/composer.json
200      GET        5l       14w      134c http://192.168.143.109/vendor/paragonie/random_compat/build-phar.sh
200      GET       19l      167w     1060c http://192.168.143.109/vendor/symfony/deprecation-contracts/LICENSE
200      GET        5l       15w      159c http://192.168.143.109/vendor/symfony/deprecation-contracts/CHANGELOG.md
200      GET        4l        6w      132c http://192.168.143.109/vendor/doctrine/annotations/phpbench.json.dist
200      GET       35l       66w      843c http://192.168.143.109/vendor/symfony/deprecation-contracts/composer.json
200      GET       19l      167w     1065c http://192.168.143.109/vendor/doctrine/annotations/LICENSE
200      GET       26l      163w     1204c http://192.168.143.109/vendor/symfony/deprecation-contracts/README.md
200      GET       17l       32w     1035c http://192.168.143.109/vendor/doctrine/annotations/README.md
200      GET       20l      169w     1081c http://192.168.143.109/vendor/phpseclib/phpseclib/LICENSE
200      GET       13l       49w      818c http://192.168.143.109/vendor/doctrine/annotations/phpstan.neon
200      GET        6l       20w      279c http://192.168.143.109/vendor/phpseclib/phpseclib/AUTHORS
200      GET        8l       26w      339c http://192.168.143.109/vendor/phpseclib/phpseclib/BACKERS.md
200      GET      162l      927w     9158c http://192.168.143.109/vendor/doctrine/annotations/CHANGELOG.md
200      GET       28l       71w      873c http://192.168.143.109/vendor/symfony/polyfill-php72/README.md
200      GET       45l      103w     1520c http://192.168.143.109/vendor/doctrine/annotations/composer.json
200      GET       30l      160w     2332c http://192.168.143.109/vendor/phpoffice/phpspreadsheet/README.md
200      GET      123l      571w     6698c http://192.168.143.109/vendor/maennchen/zipstream-php/README.md
200      GET       75l      185w     2179c http://192.168.143.109/vendor/phpseclib/phpseclib/composer.json
200      GET       89l      227w     2856c http://192.168.143.109/vendor/phpoffice/phpspreadsheet/composer.json
200      GET       21l      169w     1079c http://192.168.143.109/vendor/phpoffice/phpspreadsheet/LICENSE
200      GET       11l      121w      842c http://192.168.143.109/vendor/phpoffice/phpspreadsheet/CONTRIBUTING.md
200      GET       35l       78w      949c http://192.168.143.109/vendor/symfony/polyfill-php72/composer.json
200      GET       55l      115w     1901c http://192.168.143.109/vendor/maennchen/zipstream-php/psalm.xml
200      GET       24l      189w     1265c http://192.168.143.109/vendor/maennchen/zipstream-php/LICENSE
200      GET       19l      167w     1065c http://192.168.143.109/vendor/symfony/polyfill-php72/LICENSE
200      GET       41l       97w      957c http://192.168.143.109/vendor/maennchen/zipstream-php/composer.json
200      GET       17l       21w      439c http://192.168.143.109/vendor/maennchen/zipstream-php/phpunit.xml.dist
200      GET       37l       84w     1046c http://192.168.143.109/vendor/symfony/polyfill-php70/composer.json
200      GET       51l      239w     1539c http://192.168.143.109/vendor/maennchen/zipstream-php/CHANGELOG.md
200      GET       34l      116w     1252c http://192.168.143.109/vendor/onelogin/php-saml/composer.json
200      GET       19l      167w     1065c http://192.168.143.109/vendor/symfony/polyfill-php70/LICENSE
200      GET       85l      259w     2488c http://192.168.143.109/vendor/robrichards/xmlseclibs/README.md
200      GET       23l      167w     1064c http://192.168.143.109/vendor/onelogin/php-saml/LICENSE
200      GET       18l       35w      737c http://192.168.143.109/vendor/onelogin/php-saml/phpunit.xml
200      GET       19l       61w      409c http://192.168.143.109/vendor/sabre/uri/ChangeLog.md
200      GET      228l     1107w     7617c http://192.168.143.109/vendor/robrichards/xmlseclibs/CHANGELOG.txt
200      GET       41l       78w      935c http://192.168.143.109/vendor/sabre/uri/composer.json
200      GET       33l       60w      755c http://192.168.143.109/vendor/symfony/finder/composer.json
200      GET       27l      222w     1569c http://192.168.143.109/vendor/sabre/uri/LICENSE
200      GET       31l      224w     1538c http://192.168.143.109/vendor/robrichards/xmlseclibs/LICENSE
200      GET       19l      167w     1065c http://192.168.143.109/vendor/symfony/finder/LICENSE
200      GET       79l      254w     1961c http://192.168.143.109/vendor/symfony/finder/CHANGELOG.md
200      GET      587l     3908w    37934c http://192.168.143.109/vendor/phpoffice/phpspreadsheet/CHANGELOG.md
200      GET       14l       33w      500c http://192.168.143.109/vendor/symfony/finder/README.md
200      GET        3l       10w      108c http://192.168.143.109/vendor/zircote/swagger-php/Changelog.md
200      GET      296l     2039w    15276c http://192.168.143.109/vendor/onelogin/php-saml/CHANGELOG
200      GET      126l      334w     3499c http://192.168.143.109/vendor/zircote/swagger-php/README.md
200      GET       72l      154w     1668c http://192.168.143.109/vendor/zircote/swagger-php/composer.json
200      GET       10l       13w      336c http://192.168.143.109/vendor/zircote/swagger-php/phpunit.xml.dist
200      GET      202l     1581w    11358c http://192.168.143.109/vendor/zircote/swagger-php/LICENSE-2.0.txt
200      GET       25l       59w      700c http://192.168.143.109/vendor/sabre/xml/README.md
200      GET       53l      133w     1406c http://192.168.143.109/vendor/sabre/xml/composer.json
200      GET       13l       29w      457c http://192.168.143.109/vendor/symfony/yaml/README.md
200      GET       27l      222w     1569c http://192.168.143.109/vendor/sabre/xml/LICENSE
200      GET      234l      991w     7102c http://192.168.143.109/vendor/sabre/xml/CHANGELOG.md
200      GET       19l      167w     1065c http://192.168.143.109/vendor/symfony/yaml/LICENSE
200      GET     1539l     8774w    63843c http://192.168.143.109/vendor/onelogin/php-saml/README.md
200      GET       47l       90w     1122c http://192.168.143.109/vendor/symfony/yaml/composer.json
404      GET        9l       31w      277c http://192.168.143.109/js2
404      GET        9l       31w      277c http://192.168.143.109/js2.php
404      GET        9l       31w      277c http://192.168.143.109/js2.html.txt
404      GET        9l       31w      277c http://192.168.143.109/css2
404      GET        9l       31w      277c http://192.168.143.109/css2.php
404      GET        9l       31w      277c http://192.168.143.109/css2.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jslib
404      GET        9l       31w      277c http://192.168.143.109/jslib.php
404      GET        9l       31w      277c http://192.168.143.109/jslib.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jsfiles
404      GET        9l       31w      277c http://192.168.143.109/jsky
404      GET        9l       31w      277c http://192.168.143.109/jsfiles.php
404      GET        9l       31w      277c http://192.168.143.109/jsky.php
404      GET        9l       31w      277c http://192.168.143.109/jsky.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jsfiles.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jss
404      GET        9l       31w      277c http://192.168.143.109/jss.php
404      GET        9l       31w      277c http://192.168.143.109/jss.html.txt
404      GET        9l       31w      277c http://192.168.143.109/jscalendar
404      GET        9l       31w      277c http://192.168.143.109/jscalendar.php
404      GET        9l       31w      277c http://192.168.143.109/jscalendar.html.txt
200      GET      661l     5535w    35181c http://192.168.143.109/LICENSE
200      GET       58l      247w     2930c http://192.168.143.109/testldap.php
200      GET       31l       55w      906c http://192.168.143.109/testapi.php
200      GET      135l      652w     6983c http://192.168.143.109/testoauth2.php
200      GET       57l      227w     3001c http://192.168.143.109/testmail.php
200      GET       94l      267w     4776c http://192.168.143.109/testssl.php
200      GET      487l     1858w    32019c http://192.168.143.109/opcache.php
200      GET       87l      498w   190707c http://192.168.143.109/favicon.ico
200      GET        2l       27w   149998c http://192.168.143.109/assets/MDI-3.4.93/css/materialdesignicons.min.css
200      GET      210l      677w    13385c http://192.168.143.109/requirements.php
200      GET        7l       12w   127805c http://192.168.143.109/assets/MDI-3.4.93/css/materialdesignicons.css.map
200      GET        7l       12w   120577c http://192.168.143.109/assets/MDI-3.4.93/css/materialdesignicons.min.css.map
200      GET    14235l    17979w   199173c http://192.168.143.109/assets/MDI-3.4.93/css/materialdesignicons.css
404      GET        9l       31w      277c http://192.168.143.109/js-global

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 844.png" >}}

we found this from dirbusting

{{< figure src="image 845.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="image 846.png" >}}

## PrivESC

Local enumeration exposed the misconfiguration, and the escalation path below was enough to move up.

{{< figure src="image 847.png" >}}

{{< figure src="image 848.png" >}}

boom we rootin

{{< figure src="image 849.png" >}}
