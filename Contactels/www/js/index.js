document.addEventListener('deviceready', loadContacts, false);

function newContact(){
    const newContact = document.getElementById('registerButton');
    newContact.onclick = createContact;

    //submit and reset form
    document.contactForm.submit();
    document.contactForm.reset();
}

function createContact(){
    var contact = navigator.contacts.create();

    const firstName = document.getElementsByName('FirstName');
    const lastName = document.getElementsByName('LastName');
    const nickName = document.getElementsByName('NickName');
    const phoneNumbers1 = document.getElementsByName('Number01');
    const phoneNumbers2 = document.getElementsByName('Number02');
    const organization = document.getElementsByName('Organization');
    const date = document.getElementsByName('Date');
    const email1 = document.getElementsByName('E-mail1');
    const email2 = document.getElementsByName('E-mail2');
    const addresse = document.getElementsByName('Addresse');

    var name = new ContactName();
        name.givenName = firstName;
        name.familyName = lastName;
    contact.name = name;
    contact.nickname = nickName;
    var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', phoneNumbers1, true);
        phoneNumbers[1] = new ContactField('work', phoneNumbers2, false);
    contact.phoneNumbers = phoneNumbers;
    contact.organization = organization;
    contact.birthday = birthday;
    var emails = [];
        emails[0] = new ContactField('e-mail_pro', email1, true);
        emails[1] = new ContactField('e-mail_other', email2, false);
    contact.emails = emails;
    var addresses = [];
        addresses[0] = new ContactAddresse('', addresse, true);
    contact.addresses = addresses;


    contact.Save(handleContactSuccess, handleContactError);
    document.contactForm.reset();
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

function handleContactSuccess(contact){
    alert("Contact crée avec succès");
}

function handleContactError(error){
    console.log("Error while getting contacts list");
    console.log(error);
}
