package domein;

import java.net.URI;
import java.sql.Connection;
import java.sql.Date;
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
    public List<Feedback> getAllFeedBackForEvenement(@PathParam("evenementId") int evenementId) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Feedback INNER JOIN Gebruiker ON Feedback.Gebruiker = Gebruiker.GebruikerID INNER JOIN Evenement ON Feedback.Evenement = ?")) {
                    stat.setInt(1, evenementId);
                try (ResultSet rs = stat.executeQuery()) {
                    List<Feedback> results = new ArrayList<>();
                    while (rs.next()) {
                        
                        Feedback f = new Feedback();
                        f.setFeedback(rs.getString("Feedback"));
                        Evenement e = new Evenement();
                        e.setEvenementId(rs.getInt("EvenementId"));
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
                try (Connection conn = source.getConnection()) {

            if (f.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een feedback moet een gebruiker hebben.").build());
            }

            try (PreparedStatement stat = conn.prepareStatement("SELECT MAX(FeedbackId) FROM Feedback")) {
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        f.setFeedbackId(rs.getInt(1) + 1);
                    } else {
                        f.setFeedbackId(1);
                    }
                }
            }

            try (PreparedStatement stat = conn.prepareStatement("INSERT INTO Feedback VALUES(?, ?, ?, ?)")) {
                stat.setInt(1, f.getFeedbackId());
                stat.setString(2, f.getFeedback());
                stat.setInt(3, evenementId);
                stat.setInt(4, f.getGebruiker().getGebruikerId());
                stat.executeUpdate();
            }

            return Response.created(URI.create("/" + f.getFeedbackId())).build();

        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{evenementId}/{feedbackId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Feedback getFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Feedback INNER JOIN Evenement ON Feedback.Evenement = Evenement.EvenementId INNER JOIN Gebruiker ON Evenement.Gebruiker = Gebruiker.GebruikerId WHERE Feedback.FeedbackId = ? AND Feedback.evenement = ?;")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, evenementId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        
                        Feedback f = new Feedback();
                        f.setFeedbackId(rs.getInt("FeedbackId"));
                        f.setFeedback(rs.getString("Feedback"));
                        
                        Evenement e = new Evenement();
                        e.setEvenementId(rs.getInt("EvenementId"));
                        e.setTitel(rs.getString("Titel"));
                        e.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        f.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        e.setLocatie(l);
                        f.setEvenement(e);

                        return f;
                    } else {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{evenementId}/{feedbackId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId, Feedback f) {
       try (Connection conn = source.getConnection()) {
            if (f.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een feedback moet een gebruiker hebben.").build());
            }
            
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Feedback WHERE FeedbackId = ? AND EvenementId = ?")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, evenementId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("UPDATE Feedback SET Feedback = ? WHERE feedbackId = ?")) {
                
                stat.setString(1, f.getFeedback());
                stat.setInt(2, f.getFeedbackId());
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
            
    @Path("{evenementId}/{feedbackId}")
    @DELETE
    public void removeFeedback(@PathParam("evenementId") int evenementId, @PathParam("feedbackId") int feedbackId) {
       try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Feedback WHERE FeedbackId = ? AND EvenementId = ?")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, evenementId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("DELETE FROM Feedback WHERE FeedbackId = ?")) {
                stat.setInt(1, feedbackId);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }    
}
