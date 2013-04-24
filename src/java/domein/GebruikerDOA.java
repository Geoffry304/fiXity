/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package domein;

import java.net.URI;
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
import javax.ws.rs.core.Response.Status;

/*
 * De "users" resource.
 * Deze ondersteunt CRUD operaties voor objecten van de klasse User.
 */

    

@Stateless
@Path("gebruikers")
public class GebruikerDOA {

    @Resource(name = "jdbc/onzebuurt")
    private DataSource source;

    /*
     * Alle gebruikers opvragen.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Gebruiker> getAllGebruikers() {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM gebruiker")) {
                try (ResultSet rs = stat.executeQuery()) {
                    List<Gebruiker> results = new ArrayList<>();
                    while (rs.next()) {
                        Gebruiker u = new Gebruiker();
                        u.setGebruikerId(rs.getInt("gebruikerId"));
                        u.setNaam(rs.getString("naam"));
                        u.setVoornaam(rs.getString("voornaam"));
                        results.add(u);
                    }
                    return results;
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    /*
     * Een nieuwe gebruiker toevoegen.
     * Het ingediende User object hoeft geen ID te hebben, dit wordt vanzelf
     * ingevuld.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addUser(Gebruiker u) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT MAX(gebruikerId) FROM gebruiker")) {
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        u.setGebruikerId(rs.getInt(1) + 1);
                    } else {
                        u.setGebruikerId(1);
                    }
                }
            }
            
            try (PreparedStatement stat = conn.prepareStatement("INSERT INTO gebruiker VALUES(?, ?, ?, ?)")) {
                stat.setInt(1, u.getGebruikerId());
                stat.setString(2, u.getNaam());
                stat.setString(3, u.getVoornaam());
                stat.setString(4, u.getEmail());
                //stat.setChar(5, u.getPassword());
                //stat.setString(6, u.getGeboortedatum());                
                stat.executeUpdate();
            }
            
            return Response.created(URI.create("/" + u.getGebruikerId())).build();
            
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    /*
     * Een bestaande gebruiker opvragen op basis van zijn ID.
     */
    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Gebruiker getGebruiker(@PathParam("id") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM gebruiker gebruikerId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (rs.next()) {
                        Gebruiker u = new Gebruiker();
                        u.setGebruikerId(rs.getInt("gebruikerId"));
                        u.setNaam(rs.getString("naam"));
                        return u;
                    } else {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    /*
     * Een bestaande gebruiker met het opgegeven ID wijzigen.
     * Het ingediende User object hoeft geen ID te hebben, aangezien deze ID
     * reeds in de URL te vinden is.
     */
    @Path("{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateUser(@PathParam("id") int id, Gebruiker u) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * gebruiker gebruikerId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            try (PreparedStatement stat = conn.prepareStatement("UPDATE gebruiker SET naam = ? WHERE gebruikerId = ?")) {
                stat.setString(1, u.getNaam());
                stat.setInt(2, id);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    
    /*
     * Een bestaande gebruiker met het opgegeven ID verwijderen.
     */
    @Path("{id}")
    @DELETE
    public void removeUser(@PathParam("id") int id) {
        try (Connection conn = source.getConnection()) {
            try (PreparedStatement stat = conn.prepareStatement("SELECT * FROM gebruiker gebruikerId = ?")) {
                stat.setInt(1, id);
                try (ResultSet rs = stat.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException(Response.Status.NOT_FOUND);
                    }
                }
            }
            try (PreparedStatement stat = conn.prepareStatement("DELETE FROM gebruiker gebruikerId = ?")) {
                stat.setInt(1, id);
                stat.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new WebApplicationException(ex);
        }
    }
    }
