/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package domein;

/**
 *
 * @author Geoff
 */
public class Melding {
    
    private int meldingId;
    private String titel, details;
    private Gebruiker gebruiker;
    private Locatie locatie;

    public Melding(int meldingId, String titel, String details, Gebruiker gebruiker, Locatie locatie) {
        this.meldingId = meldingId;
        this.titel = titel;
        this.details = details;
        this.gebruiker = gebruiker;
        this.locatie = locatie;
    }

    Melding() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public int getMeldingId() {
        return meldingId;
    }

    public void setMeldingId(int meldingId) {
        this.meldingId = meldingId;
    }

    public String getTitel() {
        return titel;
    }

    public void setTitel(String titel) {
        this.titel = titel;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Gebruiker getGebruiker() {
        return gebruiker;
    }

    public void setGebruiker(Gebruiker gebruiker) {
        this.gebruiker = gebruiker;
    }

    public Locatie getLocatie() {
        return locatie;
    }

    public void setLocatie(Locatie locatie) {
        this.locatie = locatie;
    }
    
    
    
}
