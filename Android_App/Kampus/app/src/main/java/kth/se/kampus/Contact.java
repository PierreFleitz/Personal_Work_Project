package kth.se.kampus;

//Represents a contact for the DirectoryActivity
public class Contact {
    private String firstName, familyName, mail, work, telephone, address, link;

    public Contact(String firstName, String familyName, String mail, String work, String telephone, String address, String link){
        this.firstName = firstName;
        this.familyName = familyName;
        this.mail = mail;
        this.work = work;
        this.telephone = telephone;
        this.address = address;
        this.link = link;
    }

    public String getFirstName() { return firstName; }

    public String getFamlilyName() {
        return familyName;
    }

    public String getMail() {
        return mail;
    }

    public String getWork() {
        return work;
    }

    public String getTelephone() {
        return telephone;
    }

    public String getAddress() {
        return address;
    }

    public String getLink() {
        return link;
    }
}
