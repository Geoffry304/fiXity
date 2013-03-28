package domein;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.sql.DataSource;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;



@Stateless
@Path("evenements/feedback")
public class FeedbackDOA {
    
        @Resource(name = "jdbc/onzebuurt")
    private DataSource source;
        
        
    @Path("{evenementId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Feedback> getAllFeedBackForEvenement(@PathParam("evenemntId") int evenementId) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Feedback INNER JOIN Gebruiker ON Feedback.Gebruiker = Gebruiker.GebruikerID INNER JOIN Evenement ON Feedback.Evenement = ?")) {
                    stat.setInt(1, evenementId);
                try (ResultSet rs = stat.executeQuery()) {
                    List<Feedback> results = new ArrayList<>();
                    while (rs.next()) {
                        
                        Feedback f = new Feedback();
                        f.setFeedback(rs.getString("Feedback"));
                        Evenement e = new Evenement();
                        e.setEvenementId(rs.getInt("EvenementenId"));
                        f.setEvenement(e);
                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        e.setGebruiker(g);


                        results.add(f);
                    }
                    return results;
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);


        }
    }
    
    @Path("{evenementId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addFeedbackToEvenement(@PathParam("evenementId") int evenementId, Feedback f) {
        return null; // in te vullen
    }
    
    @Path("{evenementId}/{feedbackId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Feedback getFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId) {
        return null; // in te vullen
    }
    
    @Path("{evenementId}/feedback/{feedbackId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId, Feedback f) {
        // in te vullen
    }
            
    @Path("{evenementId}/feedback/{feedbackId}")
    @DELETE
    public void removeFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId) {
        // in te vullen
    }    
}
