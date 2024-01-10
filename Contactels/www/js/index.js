document.addEventListener('deviceready', loadContacts, false);

function newContact(){
    let newContact = document.getElementById('register');
    newContact.onclick = createContact;
    
    //submit and reset form
    // document.contactForm.submit();
    // document.contactForm.reset();
}

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

function createContact(){
    //Create

    var infosContact ={
        //get infos form
        name:{
            givenName: document.getElementById('FirstName').value,
            familyName: document.getElementById('LastName').value
        },
        // displayName : document.getElementById('FirstName').value + ' ' + document.getElementById('LastName').value,
        nickName : document.getElementById('NickName').value,
        phoneNumbers : [{
            type : 'mobile',
            value: document.getElementById('Number01').value,
            type : 'work',
            value: document.getElementById('Number02').value
        }],
        organization : document.getElementById('Organization').value,
        emails : [{
            type : 'work',
            value: document.getElementById('E-mail1').value,
            type : 'other',
            value: document.getElementById('E-mail2').value
        }],
        addresses :[{
            type:'work',
            formatted: document.getElementById('Addresse').value,
            streetAddress:'',    
            }] 
    };

    if (infosContact.name && infosContact.phoneNumbers){
        var contact = navigator.contacts.create(infosContact);
        contact.save(handleContactSuccess, handleContactError);
    }
}

function loadContacts(){
    let options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name'];

    navigator.contacts.find(fields, showContacts, handleContactError, options);
}

function showContacts(contacts){
    // let contactHTML = '';
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
