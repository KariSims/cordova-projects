document.addEventListener('deviceready', loadContacts, false);
listenElementClick("registerButton");

// function createContact(){
//     //Create
//     var contact = navigator.contacts.create();

//     //get infos form
//     const firstName = document.getElementById('FirstName').value;
//     const lastName = document.getElementById('LastName').value;
//     const nickName = document.getElementById('NickName').value;
//     const phoneNumbers1 = document.getElementById('Number01').value;
//     const phoneNumbers2 = document.getElementById('Number02').value;
//     const organization = document.getElementById('Organization').value;
//     const email1 = document.getElementById('E-mail1').value;
//     const email2 = document.getElementById('E-mail2').value;
//     const addresse = document.getElementById('Addresse').value;
    
//     if (phoneNumbers1){
//         var names = new ContactName();
//         names.givenName = firstName;
//         names.familyName = lastName;
//         contact.name = names;
//         contact.nickname = nickName;
//         var phoneNumbers = [];
//         phoneNumbers[0] = new ContactField('mobile', phoneNumbers1, true);
//         phoneNumbers[1] = new ContactField('work', phoneNumbers2, false);
//         contact.phoneNumbers = phoneNumbers;
//         contact.organization = organization;
//         var emails = [];
//         emails[0] = new ContactField('work', email1, true);
//         emails[1] = new ContactField('other', email2, false);
//         contact.emails = emails;
//         var addresses = [];
//         addresses[0] = new ContactAddress('', '', addresse, '', '', '', true);
//         contact.addresses = addresses;

//         contact.save(handleContactSuccess, handleContactError);            
//     }
// }

function loadContacts(){
    let options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name'];

    navigator.contacts.find(fields, showContacts, handleContactError, options);
    
    // Ajoutez un gestionnaire d'événement au bouton ou à l'endroit où vous souhaitez déclencher le retour à l'accueil
    let boutonAccueil = document.getElementById('home');
    boutonAccueil.addEventListener('click', function(){
        urlAccueil = 'http://example.com/accueil-android';  
        // Ouvrir l'écran d'accueil dans le navigateur in-app
        cordova.InAppBrowser.open(urlAccueil, '_system');
        });
}

function showContacts(contacts){
    let contactItem;
    const contactList = document.getElementById('contactList');

    for (const contact of contacts) {
        contactItem = document.createElement('li');
        contactItem.innerHTML += `
            <a href="#page-contact-details">
                <img src="assets/img/contact.png" alt="contact">
                <h4><i>${contact.name.formatted}</i></h2>
                <h5><p><b>${contact.phoneNumbers[0].value}</b></p></h5>
            </a>
        `;

        contactItem.onclick = function( ){
            getContact(contact.id);
        }

        contactList.appendChild(contactItem);
    }
    
    $(contactList).listview('refresh');
}

function getContact(contactId){
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, showContact, handleContactError, options);
}

function showContact(contacts){
    const contact = contacts[0];

    const contactDetail = document.getElementById('contactDetail');
    const deleteContact = document.getElementById('deleteContact');

    let contactInfo = 
        `
        <li>
            <img src="assets/img/contact.png" alt="contact">
            <h1>Nom du Contact</h1>
            <p>${contact.name.formatted}</p>
        </li>
        <li>
            <h1>Téléphone</h1>
            <p>${contact.phoneNumbers[0].value} (mobile)</p>
        </li>
        <li>
            <h1>Adresse</h1>
            <p>${contact.addresses ? contact.addresses[0].formatted :'Non renseigne'}</p>
        </li>
        <li>
            <h1>E-mail</h1>
            <p>${contact.emails ? contact.emails[0].value :'Non renseigne'}</p>
        </li>
        <li>
            <h1>Organisation</h1>
            <p>${contact.organization ? contact.organization[0].value :'Non renseigne'}</p>
        </li>
        `;

    contactDetail.innerHTML = contactInfo;
    $(contactDetail).listview('refresh');

    deleteContact.onclick = function(){
        getContactDelete(contact.id);
    };
}

function createContact(){
    const phoneNumbers1 = document.getElementById('Number01').value;
    const phoneNumbers2 = document.getElementById('Number02').value;
    const email1 = document.getElementById('E-mail1').value;
    const email2 = document.getElementById('E-mail2').value;
    const addresse = document.getElementById('Addresse').value;
    
    var infosContact ={
        //get infos form
        name:{
            givenName: document.getElementById('FirstName').value,
            familyName: document.getElementById('LastName').value
        },
        // displayName : document.getElementById('FirstName').value + ' ' + document.getElementById('LastName').value,
        nickName : document.getElementById('NickName').value,
        phoneNumbers : [],
        emails : [],
        organization : document.getElementById('Organization').value,
        addresses : [],
    };

    if(phoneNumbers1){
        infosContact.phoneNumbers.push({type : 'work',value: document.getElementById('Number01').value});
    }
    if(phoneNumbers2){
        infosContact.phoneNumbers.push({type : 'mobile',value: document.getElementById('Number01').value});
    }
    if(email1){
        infosContact.emails.push({type : 'work',value: document.getElementById('E-mail1').value});
    }
    if(email2){
        infosContact.emails.push({type : 'other',value: document.getElementById('E-mail2').value});
    }
    if(addresse){
        infosContact.addresses.push(new ContactAddress('', '', '', '', '', addresse, true));
    }

    if (infosContact.name && infosContact.phoneNumbers){
        var contact = navigator.contacts.create(infosContact);
        contact.save(registerContactSuccess, handleContactError);
        document.contactForm.reset();
    }
}

function getContactDelete(contactId){
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, contactfindSuccess, handleContactError, options);

    function contactfindSuccess(contacts) {
        if (contacts.length > 0) {
            var contact = contacts[0];
            contact.remove(contactRemoveSuccess, contactRemoveError);
        } else {
            alert("Contact non trouvé");
        }
        
       function contactRemoveSuccess() {
          alert("Contact supprimé");
          window.location.href = '#page-contact-list';
          location.reload();
       }
 
       function contactRemoveError(message) {
          alert('Echec de suppression: ' + message);
       }
    }     
}

function registerContactSuccess(contact){
    alert("Contact crée avec succès");
    window.location.href="#page-contact-list";
    location.reload();
}

function handleContactError(error){
    console.log("Error while getting contacts list");
    console.log(error);
}
