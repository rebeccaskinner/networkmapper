#include <pcap.h>
#include <stdio.h>
//#include "monitor.h"
#define SIZE_ETHERNET 14
//monitor_t *monitor = NULL;

void got_packet(u_char *args, const struct pcap_pkthdr *header,const u_char *packet){
  printf("Packet caught\n");
  //monitor_process_packet(monitor,packet)
}


int main(int argc, char *argv[])
{
  int err;
  pcap_t *handle;                 /* Session handle */
  char *dev;                      /* The device to sniff on */
  char errbuf[PCAP_ERRBUF_SIZE];  /* Error string */
  struct bpf_program fp;          /* The compiled filter */
  char filter_exp[] = "tcp";  /* The filter expression */
  bpf_u_int32 mask;               /* Our netmask */
  bpf_u_int32 net;                /* Our IP */
  struct pcap_pkthdr header;      /* The header that pcap gives us */
  const u_char *packet;           /* The actual packet */

  //Init session monitor
  //monitor = monitor_init();


  /* Define the device */
  if (argc > 1) {
    dev = argv[1];
  }
  else{
    dev = pcap_lookupdev(errbuf);
  }
  /* Be sure the device is defined*/
  if (dev == NULL) {
    fprintf(stderr, "Couldn't find default device: %s\n", errbuf);
    return(2);
  }
  /* Find the properties for the device */
  if (pcap_lookupnet(dev, &net, &mask, errbuf) == -1) {
    fprintf(stderr, "Couldn't get netmask for device %s: %s\n", dev, errbuf);
    net = 0;
    mask = 0;
  }
  /* Open the session in promiscuous mode */
  handle = pcap_open_live(dev, BUFSIZ, 1, 1000, errbuf);
  if (handle == NULL) {
    fprintf(stderr, "Couldn't open device %s: %s\n", dev, errbuf);
    return(2);
  }
  /* Compile and apply the filter */
  if (pcap_compile(handle, &fp, filter_exp, 0, net) == -1) {
    fprintf(stderr, "Couldn't parse filter %s: %s\n", filter_exp, pcap_geterr(handle));
    return(2);
  }
  if (pcap_setfilter(handle, &fp) == -1) {
    fprintf(stderr, "Couldn't install filter %s: %s\n", filter_exp, pcap_geterr(handle));
    return(2);
  }
  if(pcap_loop(handle,-1,got_packet,NULL) == -1){
    fprintf(stderr, "Loop encountered error: %s\n", pcap_geterr(handle));
    pcap_close(handle);
    return(2);
  }
  pcap_close(handle);
  return(0);
}
