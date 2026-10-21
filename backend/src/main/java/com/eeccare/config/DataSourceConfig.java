package com.eeccare.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.*;
import java.util.Enumeration;

@Slf4j
@Configuration
public class DataSourceConfig {

    @Value("${spring.profiles.active:auto}")
    private String activeProfile;

    @Bean
    @Primary
    public DataSource dataSource() {
        // 1. If explicitly set to local, skip cloud check
        if ("local".equalsIgnoreCase(activeProfile)) {
            log.info("[EEC CARE] Explicitly configured for LOCAL profile.");
            return createLocalDataSource();
        }

        // 2. If explicitly set to cloud, connect directly to Supabase
        if ("cloud".equalsIgnoreCase(activeProfile)) {
            log.info("[EEC CARE] Explicitly configured for CLOUD profile (Supabase).");
            return createCloudDataSource();
        }

        // 3. Auto-detect: Check if on College Wi-Fi (10.x.x.x subnet blocks port 5432)
        boolean isCampusNetwork = isCollegeNetworkDetected();
        if (isCampusNetwork) {
            log.info("[EEC CARE] ================================================================");
            log.info("[EEC CARE] College Wi-Fi detected (10.x.x.x subnet). Port 5432 is firewall-blocked.");
            log.info("[EEC CARE] Starting in LOCAL mode (Embedded H2). Website & APIs are 100% active!");
            log.info("[EEC CARE] TIP: Connect to Phone Hotspot anytime to use Supabase Cloud directly.");
            log.info("[EEC CARE] ================================================================");
            return createLocalDataSource();
        }

        // 4. On home network or mobile hotspot: Probe Supabase reachability
        boolean supabaseReachable = false;
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("aws-0-ap-northeast-2.pooler.supabase.com", 5432), 2000);
            supabaseReachable = true;
            log.info("[EEC CARE] >>> Supabase Cloud Database is REACHABLE! Connected to Supabase Cloud PostgreSQL. <<<");
        } catch (Exception e) {
            log.warn("[EEC CARE] Supabase Cloud (Port 5432) is unreachable: {}", e.getMessage());
        }

        if (supabaseReachable) {
            try {
                return createCloudDataSource();
            } catch (Exception e) {
                log.error("[EEC CARE] Error connecting to Supabase Cloud. Falling back to Local H2.", e);
                return createLocalDataSource();
            }
        } else {
            log.info("[EEC CARE] >>> Starting in Local Offline Mode with Embedded Database. <<<");
            return createLocalDataSource();
        }
    }

    private boolean isCollegeNetworkDetected() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces != null && interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();
                if (iface.isLoopback() || !iface.isUp()) continue;
                Enumeration<InetAddress> addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress addr = addresses.nextElement();
                    if (addr instanceof Inet4Address) {
                        String ip = addr.getHostAddress();
                        if (ip.startsWith("10.")) {
                            return true;
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return false;
    }

    private DataSource createCloudDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require");
        config.setUsername("postgres.tiknudsevxjqhayzqzde");
        config.setPassword("Alfyyy@35553");
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(8000);
        config.setPoolName("SupabaseCloudPool");
        return new HikariDataSource(config);
    }

    private DataSource createLocalDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:file:./data/eeccaredb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL");
        config.setUsername("sa");
        config.setPassword("");
        config.setDriverClassName("org.h2.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setPoolName("LocalH2Pool");
        return new HikariDataSource(config);
    }
}
