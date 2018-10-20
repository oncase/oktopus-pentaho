FROM julianacarvalho/baserver-ce-8.1.0.0-365

# Dependencies
RUN sudo add-apt-repository -r ppa:fossfreedom/byzanz
RUN sudo apt-get -qq update && sudo apt-get -qq -y install zip

ENV PEN_HOME="/pentaho/pentaho-server"
ENV PEN_SYSTEM="${PEN_HOME}/pentaho-solutions/system"
RUN rm -rf ${PEN_HOME}/pentaho-solutions/system/jackrabbit/repository \
      ${PEN_HOME}/tomcat/temp/* \
      ${PEN_HOME}/tomcat/logs/* \
      ${PEN_HOME}/tomcat/work/*

# Mounts this plugin into the image
COPY ./ ${PEN_SYSTEM}/oktopus

RUN sudo chown -R pentaho.pentaho ${PEN_HOME}/
