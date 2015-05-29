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

                FileUtil.readFileOut(new File("src/main/js/injector.js"), out);

                FileUtil.eachFile(new File("src/main/js/modules"), (f) -> {
                    FileUtil.readFileOut(f, out);
                });

                FileUtil.readFileOut(new File("src/main/js/bot.js"), out);
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
