<?php
// Set headers for AJAX response
header('Content-Type: application/json');

// Database connection parameters
$host = 'localhost';
$dbname = 'uiucitbp_uiucevent_forms'; // Replace with your actual database name
$username = 'uiucitbp_user'; // Replace with your actual username
$password = 'fozsog-mappib-tutPy0'; // Replace with your actual password

try {
    // Create database connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $eventType = $_POST['event-type'] ?? '';
    $graduationDate = $_POST['graduation-date'] ?? null;
    $groupSize = $_POST['group-size'] ?? '';
    $sessionDate = $_POST['session-date'] ?? '';
    $sessionTime = $_POST['session-time'] ?? '';
    $location = $_POST['location'] ?? '';
    $customLocation = $_POST['custom-location'] ?? '';
    
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO booking_submissions 
                          (name, email, phone, event_type, graduation_date, group_size, 
                           session_date, session_time, location, custom_location) 
                          VALUES (:name, :email, :phone, :event_type, :graduation_date, :group_size,
                                  :session_date, :session_time, :location, :custom_location)");
    
    // Bind parameters
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':event_type', $eventType);
    $stmt->bindParam(':graduation_date', $graduationDate);
    $stmt->bindParam(':group_size', $groupSize);
    $stmt->bindParam(':session_date', $sessionDate);
    $stmt->bindParam(':session_time', $sessionTime);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':custom_location', $customLocation);
    
    // Execute statement
    $stmt->execute();

    $to = "uiuceventphotos@gmail.com"; // Change this to your actual email address
    $subject = "New Photography Booking Inquiry";

    // Build a complete message with all form fields
    $message = "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "Event Type: $eventType\n";
    $message .= "Timeframe: $timeframe\n";
    $message .= "Package: $package\n";
    $message .= "Group Size: $groupSize\n";

    if (!empty($notes)) {
        $message .= "Additional Notes: $notes\n";
    }

    // Add submission timestamp
    $message .= "\nSubmitted on: " . date("Y-m-d H:i:s");

    // Headers for better email handling
    $headers = "From: UIUC Event Photos <noreply@uiuceventphotos.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send the email
    mail($to, $subject, $message, $headers);
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'Booking submitted successfully']);
    
} catch(PDOException $e) {
    // Return error response
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    
    // Log error (optional)
    error_log('Booking submission error: ' . $e->getMessage());
}
?>