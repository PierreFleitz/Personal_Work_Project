package kth.se.kampus;

import net.htmlparser.jericho.Attribute;
import net.htmlparser.jericho.Attributes;
import net.htmlparser.jericho.Element;
import net.htmlparser.jericho.Source;
import net.htmlparser.jericho.Tag;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class NewsParser {
    private InputStreamReader in;

    public NewsParser(InputStreamReader in) {
        this.in = in;
    }

    public ArrayList<New> readNews() {
        ArrayList<New> news = new ArrayList<>();

        try {
            Source source = new Source(in);
            List<Tag> tags = source.getAllTags();
            for(Tag t: tags){
                Attributes attributes = t.parseAttributes();
                if(attributes!=null) {
                    for (Attribute attribute : attributes) {
                        String value = attribute.getValue();
                        if(value!=null) {
                            if (value.equals("odd") || value.equals("even")) {
                                Element e = t.getElement();
                                List<Element> childElems = e.getChildElements();
                                String title = "";
                                String link = "";
                                String date = "";
                                String imgSrc = "";

                                if(childElems.size()>1){

                                    List<Element> hrefElems = childElems.get(0).getChildElements();

                                    if(hrefElems.size()>0) {
                                        link = "http://kth.se" + hrefElems.get(0).getAttributeValue("href"); //GET URL
                                        title = hrefElems.get(0).getContent().toString(); //GET TITLE

                                        if(childElems.get(1).getChildElements().size()>0){
                                            imgSrc = "http://kth.se" + childElems.get(1).getChildElements().get(0).getAttributeValue("src");    //GET IMG URL
                                        }

                                        if(childElems.size()>2) {
                                            date = childElems.get(2).getContent().toString(); //GET DATE
                                        }

                                        if(!title.equals("") && !link.equals("")){
                                            if(imgSrc.equals("")) news.add(new New(title, date, new URL(link), null));
                                            else news.add(new New(title, date, new URL(link), new URL(imgSrc)));
                                        }
                                    }
                                }

                            }
                        }

                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return news;

    }
}
