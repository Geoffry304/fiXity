
package domein;

public class FeedbackMelding {
   
    
    private int feedbackId;
    private String feedback;
    private Melding melding;
    private Gebruiker gebruiker;

    public FeedbackMelding(int feedbackId, String feedback, Evenement evenement, Gebruiker gebruiker) {
        this.feedbackId = feedbackId;
        this.feedback = feedback;
        this.melding = melding;
        this.gebruiker = gebruiker;
    }

    FeedbackMelding() {
        
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

    public Melding getMelding() {
        return melding;
    }

    public void setMelding(Melding melding) {
        this.melding = melding;
    }

    public Gebruiker getGebruiker() {
        return gebruiker;
    }

    public void setGebruiker(Gebruiker gebruiker) {
        this.gebruiker = gebruiker;
    }
    
    
    
}
