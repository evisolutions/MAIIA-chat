<?php
/**
 * Plugin Name: MAIIA AI Chatbot
 * Description: A simple plugin to embed MAIIA AI Chatbot into Wordpress.
 * Version: 1.0
 * Author: MAIIA AI and Evi Solutions Collab Team
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function mojo_enqueue_chat_widget() {
    // Vue
    wp_enqueue_script('vue', 'https://unpkg.com/vue@3/dist/vue.global.prod.js');

    // Vue Demi
    wp_enqueue_script('vue-demi', 'https://unpkg.com/vue-demi@0.14.7/lib/index.iife.js');

    // Pinia
    wp_enqueue_script('pinia', 'https://unpkg.com/pinia@2.1.7/dist/pinia.iife.prod.js');

    // Vuetify
    wp_enqueue_style('vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@3.4.9/dist/vuetify.min.css');
    wp_enqueue_script('vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@3.4.9/dist/vuetify.min.js');

    // Material Design Icons
    wp_enqueue_style('mdi', 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css');

    // Get options
    $domain = get_option('mojo_domain', 'maiia.perfection-studio.com');
    $property_id = get_option('mojo_property_id', '15');
    $conversation_type = get_option('mojo_conversation_type', 'support');
    $z_index = get_option('mojo_z_index', '9999');

    // Mojo Widget Styles & Script
    wp_enqueue_style('mojo-widget', "https://{$domain}/style.css");
    wp_enqueue_script('mojo-widget', "https://{$domain}/maiia-widget.umd.js");
    ?>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            const checkDependencies = setInterval(() => {
                if (window.Vue && window.VueDemi && window.Pinia && window.Vuetify && window.MaiiaWidget) {
                    clearInterval(checkDependencies);
                    console.log('Dependencies loaded');

                    try {
                        const widget = window.MaiiaWidget.init('app', {
                            theme: 'light',
                            propertyId: '<?php echo esc_js($property_id); ?>',
                            conversationType: '<?php echo esc_js($conversation_type); ?>',
                            zIndex: '<?php echo esc_js($z_index); ?>'
                        });
                        console.log('Widget initialized successfully');
                    } catch (error) {
                        console.error('Widget initialization error:', error);
                    }
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkDependencies);
                console.error('Timeout waiting for dependencies');
            }, 5000);
        });
    </script>
    <div id="app"></div>
    <?php
}
add_action('wp_footer', 'mojo_enqueue_chat_widget');

// Admin settings
function mojo_register_settings() {
    add_option('mojo_domain', 'maiia.perfection-studio.com');
    add_option('mojo_property_id', '15');
    add_option('mojo_conversation_type', 'support');
    add_option('mojo_z_index', '9999');
    register_setting('mojo_options_group', 'mojo_domain');
    register_setting('mojo_options_group', 'mojo_property_id');
    register_setting('mojo_options_group', 'mojo_conversation_type');
    register_setting('mojo_options_group', 'mojo_z_index');
}
add_action('admin_init', 'mojo_register_settings');

function mojo_register_options_page() {
    add_options_page('Mojo AI Chatbot', 'Mojo AI Chatbot', 'manage_options', 'mojo-chat', 'mojo_options_page');
}
add_action('admin_menu', 'mojo_register_options_page');

function mojo_options_page() {
    ?>
    <div class="wrap">
        <h2>Mojo AI Chatbot Settings</h2>
        <form method="post" action="options.php">
            <?php settings_fields('mojo_options_group'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="mojo_domain">Domain</label></th>
                    <td><input type="text" id="mojo_domain" name="mojo_domain"
                             value="<?php echo get_option('mojo_domain'); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mojo_property_id">Property ID</label></th>
                    <td><input type="text" id="mojo_property_id" name="mojo_property_id"
                             value="<?php echo get_option('mojo_property_id'); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mojo_conversation_type">Conversation Type</label></th>
                    <td><input type="text" id="mojo_conversation_type" name="mojo_conversation_type"
                             value="<?php echo get_option('mojo_conversation_type'); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mojo_z_index">Z-Index</label></th>
                    <td><input type="text" id="mojo_z_index" name="mojo_z_index"
                             value="<?php echo get_option('mojo_z_index'); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
