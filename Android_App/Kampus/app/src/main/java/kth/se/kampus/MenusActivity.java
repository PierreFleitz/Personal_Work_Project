package kth.se.kampus;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MenusActivity extends ActionBarActivity {
    private StorageManager sManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menus);

        final String[] restaurants = {"Nymble", "Muhuren catering", "Restaurant Q", "Fågelängen catering", "Buffet in Ljusgården"};

        ListView listView = (ListView) findViewById(R.id.list_view_menu);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.item, restaurants);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

                //TODO
            }
        });
    }

}
