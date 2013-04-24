
package domein;

public class Feedback {
    
    private int feedbackId;
    private String feedback;
    private Evenement evenement;
    private Gebruiker gebruiker;

    public Feedback(int feedbackId, String feedback, Evenement evenement, Gebruiker gebruiker) {
        this.feedbackId = feedbackId;
        this.feedback = feedback;
        this.evenement = evenement;
        this.gebruiker = gebruiker;
    }

    Feedback() {
       
    }

    public int getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(int feedbackId) {
        this.feedbackId = feedbackId;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Evenement getEvenement() {
        return evenement;
    }

    public void setEvenement(Evenement evenement) {
        this.evenement = evenement;
    }

    public Gebruiker getGebruiker() {
        return gebruiker;
    }

    public void setGebruiker(Gebruiker gebruiker) {
        this.gebruiker = gebruiker;
    }
    
    
    
    
    
}
