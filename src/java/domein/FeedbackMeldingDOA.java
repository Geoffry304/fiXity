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
@Path("meldingen/feedback")
public class FeedbackMeldingDOA {
    
        @Resource(name = "jdbc/onzebuurt")
    private DataSource source;
        
        
    @Path("{meldingId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<FeedbackMelding> getAllFeedBackForMelding(@PathParam("meldingId") int meldingId) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM FeedbackMelding INNER JOIN Gebruiker ON FeedbackMelding.Gebruiker = Gebruiker.GebruikerID INNER JOIN Melding ON FeedbackMelding.Melding = ?")) {
                    stat.setInt(1, meldingId);
                try (ResultSet rs = stat.executeQuery()) {
                    List<FeedbackMelding> results = new ArrayList<>();
                    while (rs.next()) {
                        
                        FeedbackMelding f = new FeedbackMelding();
                        f.setFeedback(rs.getString("Feedback"));
                        Melding m = new Melding();
                        m.setMeldingId(rs.getInt("MeldingId"));
                        f.setMelding(m);
                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        f.setGebruiker(g);


                        results.add(f);
                    }
                    return results;
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);


        }
    }
    
    @Path("{meldingId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addFeedbackToMelding(@PathParam("meldingId") int meldingId, FeedbackMelding f) {
                try (Connection conn = source.getConnection()) {

            if (f.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een feedback moet een gebruiker hebben.").build());
            }

            try (PreparedStatement stat = conn.prepareStatement("SELECT MAX(FeedbackMeldingId) FROM FeedbackMelding")) {
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        f.setFeedbackId(rs.getInt(1) + 1);
                    } else {
                        f.setFeedbackId(1);
                    }
                }
            }

            try (PreparedStatement stat = conn.prepareStatement("INSERT INTO FeedbackMeld VALUES(?, ?, ?, ?)")) {
                stat.setInt(1, f.getFeedbackId());
                stat.setString(2, f.getFeedback());
                stat.setInt(3, meldingId);
                stat.setInt(4, f.getGebruiker().getGebruikerId());
                stat.executeUpdate();
            }

            return Response.created(URI.create("/" + f.getFeedbackId())).build();

        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{meldingId}/{feedbackId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public FeedbackMelding getFeedback(@PathParam("meldingId") int meldingId, @PathParam("feedbackId") int feedbackId) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM FeedbackMelding INNER JOIN Melding ON FeedbackMelding.Melding = Melding.MeldingId INNER JOIN Gebruiker ON Melding.Gebruiker = Gebruiker.GebruikerId WHERE FeedbackMelding.FeedbackMeldingId = ? AND FeedbackMelding.melding = ?;")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, meldingId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        
                        FeedbackMelding f = new FeedbackMelding();
                        f.setFeedbackId(rs.getInt("FeedbackMeldingId"));
                        f.setFeedback(rs.getString("Feedback"));
                        
                        Melding m = new Melding();
                        m.setMeldingId(rs.getInt("MeldingId"));
                        m.setTitel(rs.getString("Titel"));
                        m.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        f.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        m.setLocatie(l);
                        f.setMelding(m);

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
    
    @Path("{meldingId}/{feedbackId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateFeedback(@PathParam("meldingId") int meldingId, @PathParam("feedbackId") int feedbackId, FeedbackMelding f) {
       try (Connection conn = source.getConnection()) {
            if (f.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een feedback moet een gebruiker hebben.").build());
            }
            
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM FeedbackMelding WHERE FeedbackMeldingId = ? AND EvenementMeldingId = ?")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, meldingId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("UPDATE FeedbackMelding SET Feedback = ? WHERE feedbackMeldingId = ?")) {
                
                stat.setString(1, f.getFeedback());
                stat.setInt(2, f.getFeedbackId());
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
            
    @Path("{meldingId}/{feedbackId}")
    @DELETE
    public void removeFeedback(@PathParam("meldingId") int meldingId, @PathParam("feedbackId") int feedbackId) {
       try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM FeedbackMelding WHERE FeedbackMeldingId = ? AND MeldingId = ?")) {
                stat.setInt(1, feedbackId);
                stat.setInt(2, meldingId);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("DELETE FROM FeedbackMelding WHERE FeedbackMeldingId = ?")) {
                stat.setInt(1, feedbackId);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }    
}
