package kth.se.kampus;

import android.content.Context;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class StorageManager {
    Context context;

    public StorageManager(Context context){
        this.context = context;
    }

    public ArrayList<New> readNews(){
        ArrayList<New> news = new ArrayList<>();

        try {
            FileInputStream fileInputStream = context.openFileInput("news.saved");

            BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            reader.close();
            String text = sb.toString();

            String [] offersS = text.split("::::");

            for(String s: offersS){
                if(!s.equals("")) {
                    String title = s.split("@@")[0];
                    String date = s.split("@@")[1];
                    String link = s.split("@@")[2];
                    String imgURL = s.split("@@")[3];
                    try {
                        news.add(new New(title, date, new URL(link), new URL(imgURL)));
                    } catch (MalformedURLException e) {
                        e.printStackTrace();
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return news;
    }


    public void saveNews(ArrayList<New> news){
        String r="";

        for (int i = 0; i < news.size()-1; i++) {
            r += news.get(i).getTitle() + "@@" + news.get(i).getDate() + "@@" + news.get(i).getUrl()+ "@@" + news.get(i).getImgUrl() + "::::";
        }
        r += news.get(news.size()-1).getTitle() + "@@" + news.get(news.size()-1).getUrl();

        try {
            FileOutputStream outputStream = context.openFileOutput("news.saved", Context.MODE_PRIVATE);
            outputStream.write(r.getBytes());
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
