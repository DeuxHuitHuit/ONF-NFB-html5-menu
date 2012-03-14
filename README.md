# ONF-NBF jQuery Menus #

- Version: 1.0
- Date: 2012-03-14
- Wiki: <https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/wiki>
- Github Repository: <https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu>
- Tags: <https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/tags>
- Issues: <https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/issues>
- Official hosting: <http://html5.onf.ca/1.0/>
	- JS <http://html5.onf.ca/1.0/jquery.onf-nfb.min.js>
	- CSS <http://html5.onf.ca/1.0/jquery.onf-nfb.css>

## Vue d'ensemble / Overview

Le plugin jQuery des menu de l'ONF sont là pour faciliter l'intégration des menus dans une application web HTML 5.

NFB's jQuery menu plugin has been created in order to facilite NFB's menu into HTML 5 webapps.

## Dépendances / Dependancies
### Obligatoire / Mandatory

- [jQuery 1.7+](http://code.jquery.com/jquery-latest.min.js) ou sur / or on [Google CDN](//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js)

### Facultatives / Optional

- [jQuery Cookie](https://github.com/carhartl/jquery-cookie) *uniquement pour la valeur du volume (sourdine) / Only for the volume (mute) value*
- [LESS](http://lesscss.org/) *uniquement pour l'environnement de developpement / Only for development*
- ntpagetag.js *uniquement pour les stats ONF / Only for NFB stats*
- [Google Analytics Async Tracking Code](http://www.google.com/analytics/) *uniquement pour les stats GA / Only for GA stats* 

## Mode d'emploi / How to use

1. Ajouter la référence vers la feuille de style dans la section \<head\> 
2. Ajouter la référence vers le script jQuery juste avant la balise \</body\> 
3. S'assurer que l'attribut @lang de la balise \<html\> soit déclarée
4. Appeler la/les méthodes qui crée les menus
	- `$.onf_nfb.menu.top({...})`
	- `$.onf_nfb.menu.bot({...})`

Pour plus de détails, consultez [la wiki](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/wiki/Doc-FR).
Vous pouvez aussi voir des exemples concret dans la [testsuite](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/blob/master/jquery.onf-nfb.testsuite.js).

1. Add the stylesheet reference in the \<head\> section
2. Add the jQuery script reference just before the \</body\> tag
3. Be sure that the @lang attribute is declared on the \<html\> tag
4. Call the methods that creates each menus
	- `$.onf_nfb.menu.top({...})`
	- `$.onf_nfb.menu.bot({...})`

For more information, please see the [wiki](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/wiki).
You can see live example in the [testsuite](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/blob/master/jquery.onf-nfb.testsuite.js).


## Compatiblité / Compatibility

- Niveau A (HTML 5 + CSS 3)

	- Google Chrome
	- Firefox 5+
	- Opera 10+
	- Safari 5+
	- Internet Explorer 9+
	- Mobile Safari iOs 4+
	- Android 2.2+ webkit browser
	
- Niveau C (HTML 5 seulement / HTML 5 only)

	- Firefox 3, 4
	- Opera 9
	- Safari 4
	- Internet Explorer 7, 8

### Bogues / Bugs

Veuillez rapporter tous les bogues rencontrer via [l'interface de GitHub](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/issues/new).

Please report all bugs via [GitHub's interface](https://github.com/DeuxHuitHuit/ONF-NBF-html5-menu/issues/new).

#### Copyrights 

- [ONF](http://www.onf.ca)/[NFB](http://www.nfb.ca)
- [Deux Huit Huit](http://www.deuxhuithuit.com)
