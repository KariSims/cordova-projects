document.addEventListener('deviceready', loadContacts, false);

function createContact(name, phone1,phone2, organization, email){
    var contact = navigator.contacts.create();
}

function loadContacts(){
    let options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name'];

    navigator.contacts.find(fields, showContacts, handleContactError, options);
}

function showContacts(contacts){
    let contactHTML = '';
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
            showContact(contacts);
        }

        contactList.appendChild(contactItem);
    }
    
    $(contactList).listview('refresh');
}

function showContact(contacts){
    const contact = contacts[0];
    const contactDetail = document.getElementById('contactDetail');
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
}

function handleContactError(error){
    console.log("Error while getting contacts list");
    console.log(error);
}

function getContact(contactId){
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, showContact, handleContactError, options);
}