package domein;

import java.util.Date;

public class Evenement {
    
    
    private int evenementId;
    private String titel, details;
    private String datum;
    private Gebruiker gebruiker;
    private Locatie locatie;
    private String afbeelding;
    
    
    public Evenement() {
    

    }

    public Evenement(int evenementId, String titel, String details, String datum, Gebruiker gebruiker, Locatie locatie) {
        this.evenementId = evenementId;
        this.titel = titel;
        this.details = details;
        this.datum = datum;
        this.gebruiker = gebruiker;
        this.locatie = locatie;
    }

    public int getEvenementId() {
        return evenementId;
    }

    public void setEvenementId(int evenementId) {
        this.evenementId = evenementId;
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

    public String getDatum() {
        return datum;
    }

    public void setDatum(String datum) {
        

          this.datum = datum;  

        
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

    public String getAfbeelding() {
        return afbeelding;
    }

    public void setAfbeelding(String afbeelding) {
        this.afbeelding = afbeelding;
    }
    
    
    
    
    
 @Override
    public int hashCode() {
        int hash = 5;
        hash = 79 * hash + this.evenementId;
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Evenement other = (Evenement) obj;
        if (this.evenementId != other.evenementId) {
            return false;
        }
        return true;
    }
    
    
    
    
}


