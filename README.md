# PerfAnalyzer
A Azure Devops Extension to Run Performance Test using Apache JMeter and Analyze Results This task enables to run Performance testng using Apache Jmeter, Analyze report and post results. This task uses Apache Jmeter 5.5 and expects a valid parametrized JMX File, Any input Files, and property file for JMX. The task runs the jmx files according to the configured values in JMX and publishes the result to $web of your storage container. You need to enable static hosting in the storage container in order to be able to view html results.
