package kth.se.kampus;

import java.net.URL;

public class New {
    private String title;
    private String date;
    private URL url;
    private URL imgUrl;

    public New(String title, String date, URL url, URL imgUrl) {
        this.title = title;
        this.date = date;
        this.url = url;
        this.imgUrl = imgUrl;
    }

    @Override
    public String toString(){
        return "title: " + title + " url: " + url + " date: " + date + " img_src:" + imgUrl;
    }


    public URL getUrl() {
        return url;
    }

    public String getTitle() {
        return title;
    }

    public String getDate(){
        return date;
    }

    public URL getImgUrl() { return imgUrl; }
}
