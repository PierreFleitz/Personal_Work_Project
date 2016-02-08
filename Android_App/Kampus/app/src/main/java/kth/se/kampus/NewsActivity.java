package kth.se.kampus;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

public class NewsActivity extends AppCompatActivity {
    private ArrayList<New> news;
    private StorageManager sManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_news);
        sManager = new StorageManager(this);

        if (isNetworkAvailable()) new NewsHandler().execute();
        else onErrorLoading();

    }

    private void onErrorLoading() {
        news = sManager.readNews();
        populateListView();
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        boolean r = activeNetworkInfo != null && activeNetworkInfo.isConnected();
        if (!r)
            Toast.makeText(getApplicationContext(), "No internet connection", Toast.LENGTH_LONG).show();
        return r;
    }


    public void populateListView() {
        final String[] myItems = new String[news.size()];
        for (int i = 0; i < myItems.length; i++) {
            myItems[i] = news.get(i).getTitle();
        }

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.item, myItems);
        ListView listView = (ListView) findViewById(R.id.list_view);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

                startOfferActivity(position);
            }
        });
    }

    private void startOfferActivity(int position) {
        Intent intent = new Intent(this, NewBrowserActivity.class);
        intent.putExtra("link", String.valueOf(news.get(position).getUrl()));
        startActivity(intent);
    }


    private class NewsHandler extends AsyncTask<URL, Integer, Long> {

        @Override
        protected Long doInBackground(URL... urls) {
            long totalSize = 0;
            try {
                URL url = new URL("https://www.kth.se/en/aktuellt/nyheter"); // TODO change language from settings
                URLConnection connection = url.openConnection();
                InputStreamReader in = new InputStreamReader((connection.getInputStream()));

                news = new NewsParser(in).readNews();

                for (New n : news) {
                    System.out.println(n);
                }
                sManager.saveNews(news);


            } catch (IOException e) {
                e.printStackTrace();
                onErrorLoading();
            }
            return totalSize;
        }

        @Override
        protected void onPostExecute(Long result) {
            populateListView();
        }

    }


    private class ImageHandler extends AsyncTask<String, String, Bitmap> {
        protected Bitmap doInBackground(String... args) {
            Bitmap bitmap = null;
            try {
                bitmap = BitmapFactory.decodeStream((InputStream) new URL(args[0]).getContent());

            } catch (Exception e) {
                e.printStackTrace();
            }
            return bitmap;
        }

        protected void onPostExecute(Bitmap image) {
            /*
            if(image != null){
                img.setImageBitmap(image);
            }else{

                Toast.makeText(NewsActivity.this, "Image Does Not exist or Network Error", Toast.LENGTH_SHORT).show();

            }
            */
        }
    }
}
