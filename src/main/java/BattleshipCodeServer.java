import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import qj.util.FileUtil;
import qj.util.IOUtil;
import qj.util.funct.P0;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by quan on 5/29/2015.
 */
public class BattleshipCodeServer {
    public static void main(String[] args) throws Exception {
        HttpServer server = new HttpServer();
        server.addServlet("/code.js", new HttpServlet() {
            @Override
            public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
                resp.setHeader("Access-Control-Allow-Origin", "*");

                ServletOutputStream out = resp.getOutputStream();


                String bot = FileUtil.readFileToString("src/main/js/bot.js");
                String includeString = "// #include All other files here";
                int start = bot.indexOf(includeString);
                int end = start + includeString.length();

                out.write(bot.substring(0, start).getBytes());

                FileUtil.readFileOut(new File("src/main/js/injector.js"), out);

                FileUtil.eachFile(new File("src/main/js/modules"), (f) -> {
                    FileUtil.readFileOut(f, out);
                });


                out.write(bot.substring(end).getBytes());
            }
        });

        server.start(1006);
    }
}

class HttpServer {

    ServletContextHandler servletContext = new ServletContextHandler(ServletContextHandler.SESSIONS);
    {
        servletContext.setContextPath("/");
    }

    public P0 start(int port) throws Exception {
        final Server server = new Server(port);
        server.setHandler(servletContext);
        server.start();

        return () -> {
            try {
                server.stop();
            } catch (Exception e) {
                ;
            }
        };
    }

    public HttpServer addServlet(String url, HttpServlet servlet) {
        servletContext.addServlet(new ServletHolder(servlet), url);
        return this;
    }
}
