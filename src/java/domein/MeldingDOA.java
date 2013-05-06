 /*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
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
@Path("meldingen")
public class MeldingDOA {
    
    @Resource(name = "jdbc/onzebuurt")
    private DataSource source;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addMelding(Melding m) {
        try (Connection conn = source.getConnection()) {

            if (m.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een melding moet een gebruiker hebben.").build());
            }

            try (PreparedStatement stat = conn.prepareStatement("SELECT MAX(meldingId) FROM Melding")) {
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        m.setMeldingId(rs.getInt(1) + 1);
                    } else {
                        m.setMeldingId(1);
                    }
                }
            }

            try (PreparedStatement stat = conn.prepareStatement("INSERT INTO Melding VALUES(?, ?, ?, ?, ?, ?)")) {
                stat.setInt(1, m.getMeldingId());
                stat.setString(2, m.getTitel());
                stat.setString(3, m.getDetails());
                if (m.getLocatie() != null){
                stat.setDouble(4, m.getLocatie().getLatitude());
                stat.setDouble(5, m.getLocatie().getLongitude());
                }
                else {
                    stat.setDouble(4, 0);
                stat.setDouble(5, 0);
                }
                
                stat.setInt(6, m.getGebruiker().getGebruikerId());
                stat.executeUpdate();
            }

            return Response.created(URI.create("/" + m.getMeldingId())).build();

        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Melding> getAllMeldingen() {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Melding INNER JOIN Gebruiker ON Melding.Gebruiker = Gebruiker.GebruikerId ORDER BY MeldingId DESC")) {
                try (ResultSet rs = stat.executeQuery()) {
                    List<Melding> results = new ArrayList<>();
                    while (rs.next()) {
                        Melding m = new Melding();
                        m.setMeldingId(rs.getInt("MeldingId"));
                        m.setTitel(rs.getString("Titel"));
                        m.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        m.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        m.setLocatie(l);

                        results.add(m);
                    }
                    return results;
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);


        }
    }

    @Path("{meldingId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Melding getMelding(@PathParam("meldingId") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Melding INNER JOIN Gebruiker ON Melding.Gebruiker = Gebruiker.GebruikerId WHERE Melding.meldingId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        Melding m = new Melding();
                        m.setMeldingId(rs.getInt("MeldingId"));
                        m.setTitel(rs.getString("Titel"));
                        m.setDetails(rs.getString("Details"));

                        Gebruiker g = new Gebruiker();
                        g.setGebruikerId(rs.getInt("Gebruiker.GebruikerId"));
                        g.setNaam(rs.getString("Naam"));
                        g.setVoornaam(rs.getString("Voornaam"));
                        m.setGebruiker(g);

                        Locatie l = new Locatie();
                        l.setLatitude(rs.getDouble("Latitude"));
                        l.setLongitude(rs.getDouble("Longitude"));
                        m.setLocatie(l);

                        return m;
                    } else {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{meldingId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateMelding(@PathParam("meldingId") int id,  Melding m) {
        try (Connection conn = source.getConnection()) {
            if (m.getGebruiker() == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Een melding moet een gebruiker hebben.").build());
            }
            
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Melding WHERE MeldingId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("UPDATE Melding SET Titel = ?, Details = ?, Gebruiker = ?, Latitude = ?, Longitude =  ? WHERE meldingId = ?")) {
                
                stat.setString(1, m.getTitel());
                stat.setString(2, m.getDetails());
                stat.setInt(3, m.getGebruiker().getGebruikerId());
                stat.setDouble(4, m.getLocatie().getLatitude());
                stat.setDouble(5, m.getLocatie().getLongitude());
                stat.setInt(7, m.getMeldingId());
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    @Path("{meldingId}")
    @DELETE
    public void removeMelding(@PathParam("meldingId") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM Melding WHERE MeldingId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("DELETE FROM Melding WHERE MeldingId = ?")) {
                stat.setInt(1, id);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
}
