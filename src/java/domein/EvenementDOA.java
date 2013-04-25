
package domein;

import java.net.URI;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
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
@Path("evenements")
public class EvenementDOA {

    @Resource(name = "jdbc/onzebuurt")
    private DataSource source;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addEvenement(Evenement e) {
        try (Connection conn = source.getConnection()) {

            if (e.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een evenement moet een gebruiker hebben.").build());
            }

            try (PreparedStatement stat = conn.prepareStatement("SELECT MAX(evenementId) FROM Evenement")) {
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        e.setEvenementId(rs.getInt(1) + 1);
                    } else {
                        e.setEvenementId(1);
                    }
                }
            }

            try (PreparedStatement stat = conn.prepareStatement("INSERT INTO Evenement VALUES(?, ?, ?, ?, ?, ?, ?)")) {
                stat.setInt(1, e.getEvenementId());
                stat.setString(2, e.getTitel());
                stat.setString(3, e.getDetails());
                if (e.getLocatie() != null){
                stat.setDouble(4, e.getLocatie().getLatitude());
                stat.setDouble(5, e.getLocatie().getLongitude());
                }
                else {
                    stat.setDouble(4, 0);
                stat.setDouble(5, 0);
                }
                
                stat.setDate(6, new Date(e.getDatum().getTime()));
                stat.setInt(7, e.getGebruiker().getGebruikerId());
                stat.executeUpdate();
            }

            return Response.created(URI.create("/" + e.getEvenementId())).build();

        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Evenement> getAllEvenementen() {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Evenement INNER JOIN Gebruiker ON Evenement.Gebruiker = Gebruiker.GebruikerId ORDER BY evenementId DESC")) {
                try (ResultSet rs = stat.executeQuery()) {
                    List<Evenement> results = new ArrayList<>();
                    while (rs.next()) {
                        Evenement e = new Evenement();
                        e.setEvenementId(rs.getInt("EvenementId"));
                        e.setTitel(rs.getString("Titel"));
                        e.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        e.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        e.setLocatie(l);

                        results.add(e);
                    }
                    return results;
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);


        }
    }

    @Path("{evenementId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Evenement getEvenement(@PathParam("evenementId") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Evenement INNER JOIN Gebruiker ON Evenement.Gebruiker = Gebruiker.GebruikerId WHERE Evenement.evenementId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        Evenement e = new Evenement();
                        e.setEvenementId(rs.getInt("EvenementId"));
                        e.setTitel(rs.getString("Titel"));
                        e.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        e.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        e.setLocatie(l);

                        return e;
                    } else {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{evenementId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateEvenement(@PathParam("evenementId") int id, Evenement e) {
        try (Connection conn = source.getConnection()) {
            if (e.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een evenement moet een gebruiker hebben.").build());
            }
            
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Evenement WHERE EvenementId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("UPDATE Evenement SET Titel = ?, Details = ?, Gebruiker = ?, Latitude = ?, Longitude =  ?, Datum = ? WHERE evenementId = ?")) {
                
                stat.setString(1, e.getTitel());
                stat.setString(2, e.getDetails());
                stat.setInt(3, e.getGebruiker().getGebruikerId());
                stat.setDouble(4, e.getLocatie().getLatitude());
                stat.setDouble(5, e.getLocatie().getLongitude());
                stat.setDate(6, (Date) e.getDatum());
                stat.setInt(7, e.getEvenementId());
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{evenementId}")
    @DELETE
    public void removeEvenement(@PathParam("evenementId") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Evenement WHERE EvenementId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("DELETE FROM Evenement WHERE EvenementId = ?")) {
                stat.setInt(1, id);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
}
