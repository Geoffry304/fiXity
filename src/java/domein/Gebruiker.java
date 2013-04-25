/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package domein;

import java.util.Date;
/**
 *
 * @author Geoff
 */
public class Gebruiker {
    
    private int gebruikerId;
    private String naam, voornaam, email;
    private char password;
    private Date geboortedatum;
    private long uId;

    public Gebruiker(int gebruikerId, String naam, String voornaam, String email, char password, Date geboortedatum, long uId) {
        this.gebruikerId = gebruikerId;
        this.naam = naam;
        this.voornaam = voornaam;
        this.email = email;
        this.password = password;
        this.geboortedatum = geboortedatum;
        this.uId = uId;
    }

    Gebruiker() {
        
    }

    public int getGebruikerId() {
        return gebruikerId;
    }

    public void setGebruikerId(int gebruikerId) {
        this.gebruikerId = gebruikerId;
    }

    public String getNaam() {
        return naam;
    }

    public void setNaam(String naam) {
        this.naam = naam;
    }

    public String getVoornaam() {
        return voornaam;
    }

    public void setVoornaam(String voornaam) {
        this.voornaam = voornaam;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public char getPassword() {
        return password;
    }

    public void setPassword(char password) {
        this.password = password;
    }

    public Date getGeboortedatum() {
        return geboortedatum;
    }

    public void setGeboortedatum(Date geboortedatum) {
        this.geboortedatum = geboortedatum;
    }
    
    public long getUid() {
        return uId;
    }

    public void setUid(long uId) {
        this.uId = uId;
    }
    
    
    
    
}
