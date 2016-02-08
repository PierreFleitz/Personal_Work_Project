package kth.se.kampus;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.vision.barcode.Barcode;

import java.io.IOException;
import java.util.List;

public class MapsActivity extends AppCompatActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private Marker marker;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        createEditTextListener();
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        LatLng kth = new LatLng(59.348259, 18.072546);
        marker = mMap.addMarker(new MarkerOptions().position(kth).title("KTH"));
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(kth, 16));
    }


    private void createEditTextListener(){
        final EditText editText = (EditText) findViewById(R.id.edit_text_search_map);
        editText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    String strAddress = editText.getText().toString();
                    Geocoder coder = new Geocoder(MapsActivity.this);
                    List<Address> address;
                    Barcode.GeoPoint p1 = null;

                    try {
                        address = coder.getFromLocationName(strAddress,5);
                        if (address==null) {
                            System.out.println("address is null !");
                        }

                        assert address != null;
                        Address location=address.get(0);
                        location.getLatitude();
                        location.getLongitude();

                        System.out.println("LOCATION : " + location.toString()); //DEBUG
                        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                        MapsActivity.this.mMap.animateCamera(CameraUpdateFactory.newLatLng(latLng));
                        marker.remove();
                        marker = mMap.addMarker(new MarkerOptions().position(latLng).title(location.getAddressLine(0)));

                        InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);

                    } catch (IOException e) {
                        return false;
                    }
                }
                return true;
            }
        });
    }
}
