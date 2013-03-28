/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package domein;

/**
 *
 * @author Geoff
 */
public class Locatie {
    
   double latitude;
   double longitude;

    public Locatie(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    Locatie() {
        
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
   
   
   
}
